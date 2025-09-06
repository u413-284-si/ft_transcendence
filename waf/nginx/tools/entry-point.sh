#!/bin/sh
set -eu

CERT_DIR="/etc/nginx/certs"
CERT_FILES="$CERT_DIR/fullchain.pem $CERT_DIR/key.pem"
DEBOUNCE_SECONDS=1
last_reload=0

# Function to watch the cert and reload nginx on change
watch_certs() {
  echo "🔍 Starting cert watcher for: $CERT_FILES"

  inotifywait -m -e close_write $CERT_FILES | while read path action file; do
    now=$(date +%s)

    if [ $(( now - last_reload )) -ge $DEBOUNCE_SECONDS ]; then
      echo "🔄 Detected cert/key change ($file), reloading nginx..."
      nginx -s reload
      last_reload=$now
    else
      echo "⏱ Skipping duplicate reload triggered by $file (debounced)"
    fi
  done
}

# Start watcher in background
watch_certs &

# Invoke the original docker-entrypoint.sh
echo "Invoking docker-entrypoint.sh for nginx setup"
. /docker-entrypoint.sh "$@"

# Run nginx in foreground
exec "$@"
