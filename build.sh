#!/usr/bin/env bash
set -e

: "${BITCARTGEN_DOCKER_IMAGE:=bitcart/docker-compose-generator:local}"
export BITCARTGEN_DOCKER_IMAGE

# Keep the convenience script and the standard Compose workflow on the same
# build definition. This also avoids maintaining a second docker build command.
docker compose build generator

docker run -v "$PWD/compose:/app/compose" \
    --env-file <(env | grep BITCART_) \
    --env-file <(env | grep REVERSEPROXY_) \
    --env NAME="$NAME" \
    --rm "$BITCARTGEN_DOCKER_IMAGE" "$@"
