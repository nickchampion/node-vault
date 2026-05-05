AWS_PROFILE=platform.dev

start=`date +%s`

# Make sure we have the git hooks directory set
git config core.hooksPath .hooks

# Generate OpenAPI schemas for each module
pnpm run schemas || exit 1

# lint
pnpm run lint || exit 1

# typescipt checks
pnpm tsc -noEmit || exit 1

# Generate .nuxt type declarations nuxt prepare generates .nuxt/types/imports.d.ts without a full build.
npx nuxt prepare apps/nodevault &
wait || exit 1

# Build trading and backoffice in parallel (both depend on ui:build above)
NITRO_PRESET=cloudflare_module pnpm nx build @nodevault/platform.apps.nodevault || exit 1

# bundle the app
pnpm nx build @nodevault/platform.apps.api || exit 1

# Clean up
rm -rf ./tmp

end=`date +%s`
runtime=$((end-start))

echo "Build completed successfully in $runtime seconds"

exit 0
