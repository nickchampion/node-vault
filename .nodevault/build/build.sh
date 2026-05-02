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

# option to skip tests
if [ "$1" != "-s" ]
then
  # Reseed the test database with a unique name to avoid conflicts
  if [ -n "${SERVICE_CI_DATABASE_NAME}" ]; then
    pnpm run db:delete
  fi

  RANDOM_SUFFIX=$(LC_ALL=C tr -dc 'A-Z0-9' </dev/urandom | head -c 8)
  export SERVICE_CI_DATABASE_NAME="${RANDOM_SUFFIX}"

  pnpm run db:test || exit 1

  TEST_EXIT_CODE=0

  # Run component tests
  pnpm vitest --run --dir ./components --passWithNoTests --config ./vite.config.ts || TEST_EXIT_CODE=$?

  # Run integrations tests
  pnpm vitest --run --dir ./integrations --passWithNoTests --config ./vite.config.ts || TEST_EXIT_CODE=$?

  # Run module tests
  pnpm vitest --run --dir ./modules --passWithNoTests --config ./vite.config.ts || TEST_EXIT_CODE=$?

  # Run integration tests
  pnpm vitest --run --dir ./tests --passWithNoTests --config ./tests/vite.config.ts || TEST_EXIT_CODE=$?

  pnpm run db:delete || exit 1

  [ $TEST_EXIT_CODE -eq 0 ] || exit $TEST_EXIT_CODE
fi

# bundle the app
pnpm nx build @nodevault/platform.app || exit 1

# make sure it starts
node ./app/dist/app.js kill || exit 1

# Clean up
rm -rf ./tmp

end=`date +%s`
runtime=$((end-start))

echo "Build completed successfully in $runtime seconds"

exit 0
