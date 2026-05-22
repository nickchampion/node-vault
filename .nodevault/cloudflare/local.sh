APP=${1:-nodevault}

NITRO_PRESET=cloudflare_module npx nx build @nodevault/platform.apps.$APP
DEBUG=*
cp ./.nodevault/cloudflare/worker.mjs ./apps/$APP/.output/server/worker.mjs
npx wrangler dev ./apps/$APP/.output/server/worker.mjs --assets ./apps/$APP/.output/public/ --compatibility-flag nodejs_compat --port 3003
