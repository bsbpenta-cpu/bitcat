#!/usr/bin/env bash
set -euo pipefail

export BITCART_HOST="15.235.184.49"
export BITCART_BASE_PATH="/bitcat"
export BITCART_REVERSEPROXY="nginx"
export REVERSEPROXY_DEFAULT_HOST="15.235.184.49"

exec ./setup.sh "$@"
