#!/usr/bin/env bash
set -euo pipefail

# ---------------------------
# LOAD .env WITH VARIABLE EXPANSION
# ---------------------------
if [ -f ".env" ]; then
    while IFS='=' read -r key val; do
        [[ -z "$key" || "$key" =~ ^# ]] && continue
        eval "export $key=\"$val\""
    done < .env
fi

# ---------------------------
# CONFIGURATION
# ---------------------------
CONTAINER_NAME=${CONTAINER_NAME:-vault}
VAULT_UNSEAL_DIR=${VAULT_UNSEAL_DIR:-/vault/secrets/unseal}
BACKUP_DIR=${BACKUP_DIR:-./vault_backup}

# ---------------------------
# FUNCTIONS
# ---------------------------
backup_keys() {
    echo "➡️ Backing up Vault unseal keys and root token..."
    mkdir -p "$BACKUP_DIR"

    # Copy keys out of the container
    docker cp "$CONTAINER_NAME:$VAULT_UNSEAL_DIR/." "$BACKUP_DIR/"

    # Remove keys from container
    echo "🗑️ Removing keys from container..."
    docker exec "$CONTAINER_NAME" bash -c "rm -f $VAULT_UNSEAL_DIR/*"

    echo "✅ Backup saved to $BACKUP_DIR and keys removed from container."
}

restore_keys() {
    echo "➡️ Restoring Vault unseal keys and root token into container..."

    docker exec "$CONTAINER_NAME" mkdir -p "$VAULT_UNSEAL_DIR"

    # Copy files safely into rootless container
    tar -C $BACKUP_DIR -cf - . | docker exec -i "$CONTAINER_NAME" tar -C $VAULT_UNSEAL_DIR -xf - --no-same-owner

    echo "✅ Restore complete."
}

# ---------------------------
# MAIN
# ---------------------------
if [ $# -ne 1 ]; then
    echo "Usage: $0 [backup|restore]"
    exit 1
fi

case "$1" in
    backup)
        backup_keys
        ;;
    restore)
        restore_keys
        ;;
    *)
        echo "Invalid option: $1. Use 'backup' or 'restore'."
        exit 1
        ;;
esac
