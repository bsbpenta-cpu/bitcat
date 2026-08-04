#!/usr/bin/env bash
set -euo pipefail

export BITCART_HOST="15.235.184.49"
export BITCART_BASE_PATH="/bitcat"
export BITCART_REVERSEPROXY="nginx"
export REVERSEPROXY_DEFAULT_HOST="15.235.184.49"
# Keep BitCat behind the reverse proxy already running on the host.  Binding to
# loopback prevents either listener from being reachable directly from the
# public network (and, importantly, avoids claiming the host's ports 80/443).
export REVERSEPROXY_HTTP_PORT="127.0.0.1:10080"
export REVERSEPROXY_HTTPS_PORT="127.0.0.1:10443"

# The host already manages Docker and its own startup policy.  In particular,
# setup.sh's systemd registration path may restart the shared Docker daemon on
# its first run, so this deployment must never enter that path.
exec ./setup.sh --no-startup-register "$@"
