#!/bin/sh
set -eu

AUTH_CONFIG_PATH="${DSOMM_AUTH_CONFIG_PATH:-/srv/assets/auth-config.json}"

if [ -n "${DSOMM_AUTH_USERS:-}" ]; then
  mkdir -p "$(dirname "$AUTH_CONFIG_PATH")"
  {
    printf '{\n  "users": '
    printf '%s' "$DSOMM_AUTH_USERS"
    printf '\n}\n'
  } > "$AUTH_CONFIG_PATH"
elif [ ! -f "$AUTH_CONFIG_PATH" ]; then
  mkdir -p "$(dirname "$AUTH_CONFIG_PATH")"
  printf '{\n  "users": []\n}\n' > "$AUTH_CONFIG_PATH"
fi

exec "$@"
