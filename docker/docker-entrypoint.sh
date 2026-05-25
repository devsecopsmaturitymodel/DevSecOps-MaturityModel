#!/bin/sh
set -eu

AUTH_CONFIG_PATH="${DSOMM_AUTH_CONFIG_PATH:-/srv/assets/auth-config.json}"
AUTH_CONFIG_DIR="$(dirname "$AUTH_CONFIG_PATH")"

write_auth_config() {
  tmp_config="${AUTH_CONFIG_PATH}.tmp.$$"

  {
    printf '{\n  "users": '
    printf '%s' "$1"
    printf '\n}\n'
  } > "$tmp_config"

  mv "$tmp_config" "$AUTH_CONFIG_PATH"
}

if [ -n "${DSOMM_AUTH_USERS:-}" ]; then
  mkdir -p "$AUTH_CONFIG_DIR"
  write_auth_config "$DSOMM_AUTH_USERS"
elif [ ! -f "$AUTH_CONFIG_PATH" ]; then
  mkdir -p "$AUTH_CONFIG_DIR"
  printf '{\n  "users": []\n}\n' > "$AUTH_CONFIG_PATH"
fi

exec "$@"
