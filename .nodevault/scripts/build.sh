start=`date +%s`

# Make sure we have the git hooks directory set
git config core.hooksPath .hooks
chmod +x .hooks/pre-push

# Codegen
pnpm run codegen || exit 1

# Generate .nuxt type declarations (needed for typeCheck:true) and build the ui layer in parallel.
# nuxt prepare generates .nuxt/types/imports.d.ts without a full build.
# ui:build does not depend on prepare output so all three can run concurrently.
npx nuxt prepare apps/trading &
npx nuxt prepare apps/backoffice &
npx nx build @nodevault/platform.apps.ui &
wait || exit 1

# Build trading and backoffice in parallel (both depend on ui:build above)
NITRO_PRESET=cloudflare_module nx run-many --target=build --projects=@nodevault/platform.apps.backoffice,@nodevault/platform.apps.trading --parallel || exit 1

# Run lint and tests in parallel with each other (neither needs the build output)
pnpm run lint &
LINT_PID=$!

# option to skip tests
if [ "$1" != "-s" ]
then
  pnpm vitest --run --passWithNoTests --config ./vitest.config.ts &
  TEST_PID=$!
fi

wait $LINT_PID || exit 1
if [ "$1" != "-s" ]
then
  wait $TEST_PID || exit 1
fi

end=`date +%s`
runtime=$((end-start))

echo "Build completed successfully in $runtime seconds"

exit 0
