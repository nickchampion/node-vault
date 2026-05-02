#!/usr/bin/env bash
set -euo pipefail

# Allowed env names must match those in wrangler.toml ([env.<name>])
ALLOWED_ENVS=("posthog-proxy-trading-uat" "posthog-proxy-trading-sandbox" "posthog-proxy-trading-prod")
WRANGLER_CONFIG_PATH=""
WRANGLER_CMD="npx -y wrangler"
ENV_NAME="${1:-}"

usage() {
  echo "Usage: $0 <${ALLOWED_ENVS[*]}>"
  exit 1
}

[[ -z "$ENV_NAME" ]] && usage
[[ " ${ALLOWED_ENVS[*]} " != *" $ENV_NAME "* ]] && usage
[[ -z "${CLOUDFLARE_API_TOKEN:-}" ]] && { echo "CLOUDFLARE_API_TOKEN missing"; exit 2; }

if [[ "$ENV_NAME" == *"api"* ]]; then
  WRANGLER_CONFIG_PATH="wrangler-api.toml"
elif [[ "$ENV_NAME" == *"posthog"* ]]; then
  WRANGLER_CONFIG_PATH="wrangler-posthog.toml"
else
  echo "Could not determine wrangler config for env: $ENV_NAME"
  exit 3
fi

[[ ! -f "$WRANGLER_CONFIG_PATH" ]] && { echo "Config file not found: $WRANGLER_CONFIG_PATH"; exit 4; }

echo "Deploying $ENV_NAME with wrangler via npx $WRANGLER_CONFIG_PATH..."
$WRANGLER_CMD deploy --env "$ENV_NAME" --config "$WRANGLER_CONFIG_PATH"
echo "Deployment succeeded for ${ENV_NAME}"