#!/bin/sh

# Logging functions
log() {
    echo "[`date +'%Y-%m-%d %H:%M:%S'`] $1"
}

error() {
    echo "[`date +'%Y-%m-%d %H:%M:%S'`] ERROR: $1" >&2
    exit 1
}

# Create self-signed SSL Key and Certificate
if [ ! -f /etc/nginx/conf/self-signed.crt ] || [ ! -f /etc/nginx/conf/self-signed.key ]; then
    log "Creating self-signed SSL Key and Certificate"
    cp /run/secrets/site_cert /etc/nginx/conf/self-signed.crt
    cp /run/secrets/site_key /etc/nginx/conf/self-signed.key
else
    log "Self-signed SSL Key and Certificate already exist"
fi

log "Invoking docker-entrypoint.sh for nginx setup"
. /docker-entrypoint.sh "$@"

log "Starting nginx as user 'nginx'"
# exec su-exec nginx "$@"
exec "$@"
