#!/usr/bin/env bash
set -euo pipefail

export BITCART_HOST="15.235.184.49"
export BITCART_BASE_PATH="/bitcat"
export BITCART_REVERSEPROXY="nginx"
export REVERSEPROXY_DEFAULT_HOST="15.235.184.49"
# Keep BitCat behind the reverse proxy already running on the host by default.
# The loopback defaults prevent direct public access and avoid claiming ports
# 80/443, while allowing an operator to opt into a separate public port.
: "${REVERSEPROXY_HTTP_PORT:=127.0.0.1:10080}"
: "${REVERSEPROXY_HTTPS_PORT:=127.0.0.1:10443}"
export REVERSEPROXY_HTTP_PORT REVERSEPROXY_HTTPS_PORT

# The host already manages Docker and its own startup policy.  In particular,
# setup.sh's systemd registration path may restart the shared Docker daemon on
# its first run, so this deployment must never enter that path.
# Use the same stable Compose project name as compose.yaml.  Without an
# explicit name setup.sh persists an empty NAME and the runtime commands use
# `docker compose -p ""`; additionally, a plain `docker compose ps` in this
# checkout would look at a different project than the generated stack.
exec ./setup.sh "$@" --name bitcat --no-startup-register
