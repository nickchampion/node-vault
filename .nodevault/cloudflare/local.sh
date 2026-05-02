NITRO_PRESET=cloudflare_module npx nx build @nodevault/platform.apps.trading
DEBUG=*
cp ./.hectare/cloudflare/worker.mjs ./apps/trading/.output/server/worker.mjs
npx wrangler dev ./apps/trading/.output/server/worker.mjs --assets ./apps/trading/.output/public/ --compatibility-flag nodejs_als --port 3003
