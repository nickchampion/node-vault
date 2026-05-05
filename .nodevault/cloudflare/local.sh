NITRO_PRESET=cloudflare_module npx nx build @nodevault/platform.apps.trading
DEBUG=*
cp ./.nodevault/cloudflare/worker.mjs ./apps/nodevault/.output/server/worker.mjs
npx wrangler dev ./apps/nodevault/.output/server/worker.mjs --assets ./apps/nodevault/.output/public/ --compatibility-flag nodejs_als --port 3003
