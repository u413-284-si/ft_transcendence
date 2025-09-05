#!/usr/bin/env bash
set -euo pipefail

#######################################
# -- Configuration / Constants -- #
#######################################

UNSEAL_SHARES=5
UNSEAL_THRESHOLD=3
VAULT_START_TIMEOUT=60  # seconds

#######################################
# -- Utility Functions -- #
#######################################

log() {
    local level="$1"
    local msg="$2"
    echo "$(date '+%Y-%m-%d %H:%M:%S') $level $msg"
}

create_dirs() {
    mkdir -p "$VAULT_KEYS_DIR" "$NGINX_KEYS_DIR" "$APP_KEYS_DIR"
    chmod 750 "$SECRETS_DIR" "$VAULT_KEYS_DIR" "$NGINX_KEYS_DIR" "$APP_KEYS_DIR"
    chown -R vault:vault "$SECRETS_DIR" /vault/data
    log "➡️" "Directories created and permissions set"
}

run_vault() {
    log "➡️" "Starting Vault server..."
    su-exec vault:vault vault "$@" &
    VAULT_PID=$!
}

wait_for_vault() {
    log "⏳" "Waiting for Vault API to respond..."
    for i in $(seq 1 $VAULT_START_TIMEOUT); do
        if curl -s --cacert "$VAULT_CACERT" "$VAULT_ADDR/v1/sys/health" >/dev/null 2>&1; then
            log "✅" "Vault API is up"
            return 0
        fi
        sleep 1
    done
    log "❌" "Vault did not start within $VAULT_START_TIMEOUT seconds"
    exit 1
}

initialize_vault() {
    if jq -e '.initialized' >/dev/null < <(vault status --format=json); then
      log "ℹ️" "Vault already initialized"
      return 0
    fi

    log "🔐" "Vault not initialized, running vault operator init..."

    init_json="$(vault operator init \
        -key-shares="$UNSEAL_SHARES" \
        -key-threshold="$UNSEAL_THRESHOLD" \
        -format=json)"

    mapfile -t keys < <(jq -r '.unseal_keys_b64[]' <<<"$init_json")
    root_token="$(jq -r '.root_token' <<<"$init_json")"

    for i in "${!keys[@]}"; do
      printf '%s\n' "${keys[$i]}" > "$VAULT_KEYS_DIR/unseal_key_$((i+1))"
    done
    printf '%s\n' "$root_token" > "$VAULT_KEYS_DIR/root_token"
    chmod 600 "$VAULT_KEYS_DIR"/*
    chown vault:vault "$VAULT_KEYS_DIR"/*

    log "✅" "Saved ${#keys[@]} unseal keys and root token to $VAULT_KEYS_DIR"
}

unseal_vault() {
    local keys=("$@")
    if [ ${#keys[@]} -eq 0 ]; then
        log "ℹ️" "No unseal keys found, Vault will remain sealed"
        return 1
    fi

    local threshold=$UNSEAL_THRESHOLD
    (( ${#keys[@]} < threshold )) && threshold=${#keys[@]}

    for i in $(seq 0 $((threshold - 1))); do
        log "➡️" "Unsealing with key $((i+1))"
        vault operator unseal "${keys[$i]}"
    done
    log "🚀" "Vault unseal attempt complete"
}

wait_for_unseal() {
    while true; do
        keyArray=()
        for keyfile in "$VAULT_KEYS_DIR"/unseal_key_*; do
            [ -f "$keyfile" ] && keyArray+=("$(cat "$keyfile")")
        done

        if unseal_vault "${keyArray[@]}"; then
            log "✅" "Vault is unsealed"
            break
        else
            log "⏳" "Vault remains sealed, waiting for unseal keys..."
            sleep 5
        fi
    done
}

create_approle() {
    local role_name="$1"
    local policy="$2"
    local dir="$3"

    if vault read -format=json "auth/approle/role/$role_name" > /dev/null 2>&1; then
        log "ℹ️" "AppRole $role_name already exists, skipping..."
    else
        log "➡️" "Creating AppRole $role_name..."
        vault write "auth/approle/role/$role_name" \
            secret_id_ttl=0 \
            token_ttl=1h \
            token_max_ttl=4h \
            token_policies="$policy"
        log "✅" "AppRole $role_name created"
    fi

    # Save role-id and secret-id
    if [ ! -f "$dir/${role_name}-role-id" ]; then
      log "➡️" "Creating ${role_name}-role-id..."
      vault read -field=role_id "auth/approle/role/$role_name/role-id" > "$dir/${role_name}-role-id"
      chmod 600 "$dir/${role_name}-role-id"
      chown vault:vault "$dir/${role_name}-role-id"
      log "✅" "${role_name}-role-id created"
    else
      log "ℹ️" "${role_name}-role-id already exists, skipping..."
    fi

    if [ ! -f "$dir/${role_name}-secret-id" ]; then
      log "➡️" "Creating ${role_name}-secret-id..."
      vault write -field=secret_id -f "auth/approle/role/$role_name/secret-id" > "$dir/${role_name}-secret-id"
      chmod 600 "$dir/${role_name}-secret-id"
      chown vault:vault "$dir/${role_name}-secret-id"
      log "✅" "${role_name}-secret-id created"
    else
      log "ℹ️" "${role_name}-secret-id already exists, skipping..."
    fi

}

login_with_approle() {
    local role_id_file="$1"
    local secret_id_file="$2"

    if [[ -f "$role_id_file" && -f "$secret_id_file" ]]; then
        BOOTSTRAP_TOKEN=$(vault write -format=json auth/approle/login \
            role_id="$(cat "$role_id_file")" \
            secret_id="$(cat "$secret_id_file")" \
            | jq -r '.auth.client_token')
        export VAULT_TOKEN="$BOOTSTRAP_TOKEN"
        log "✅" "Bootstrap token acquired via AppRole"
    else
        log "❌" "No AppRole credentials found, cannot continue"
        ls $VAULT_KEYS_DIR
        exit 1
    fi
}

enable_kv_secrets() {
    if ! vault secrets list -format=json | jq -e '."secret/"' >/dev/null; then
        log "➡️" "Enabling KV secrets engine..."
        vault secrets enable -path=secret kv-v2
        log "✅" "KV secrets engine enabled at secret/"
    else
        log "ℹ️" "KV already enabled at secret/"
    fi
}

populate_jwt_secret() {
    vault kv put secret/jwt \
        access_token_secret=$(openssl rand -hex 32) \
        refresh_token_secret=$(openssl rand -hex 32) \
        two_fa_login_token_secret=$(openssl rand -hex 32)
    log "✅" "JWT secrets added to Vault"
}

populate_google_secret() {
    if [ -f "/run/secrets/google_secret" ]; then
        local googleSecret
        googleSecret=$(cat "/run/secrets/google_secret")
        vault kv put secret/google google_oauth2_client_secret="$googleSecret"
        log "✅" "Google secret added to Vault"
    else
        log "ℹ️" "Google secret not found, skipping..."
    fi
}

setup_ssl_ca() {
    log "➡️" "Running certificate authority setup script..."
    /usr/local/bin/setup-ssl-ca.sh || {
        log "❌" "Failed to generate certificate authority"
        kill $VAULT_PID
        exit 1
    }
    log "✅" "SSL certificate authority set up"
}

cleanup_sensitive_vars() {
    unset ROOT_TOKEN BOOTSTRAP_TOKEN VAULT_TOKEN
}

#######################################
# -- Main Script Execution -- #
#######################################

log "➡️" "Running initial setup..."
create_dirs
run_vault "$@"
wait_for_vault
initialize_vault
wait_for_unseal

if [ -f "$VAULT_KEYS_DIR/root_token" ]; then
    export VAULT_TOKEN=$(cat "$VAULT_KEYS_DIR/root_token")

    # Write policies
    vault policy write setup-policy /vault/policies/setup-policy.hcl
    vault policy write healthcheck-policy /vault/policies/healthcheck-policy.hcl
    vault policy write nginx-policy /vault/policies/nginx-policy.hcl
    vault policy write app-policy /vault/policies/app-policy.hcl

    # Enable AppRole if not already
    if ! vault auth list -format=json | jq -e '."approle/"' >/dev/null; then
    vault auth enable -path=approle approle
    log "✅" "AppRole authentication enabled"
    fi

    create_approle "setup" "setup-policy" "$VAULT_KEYS_DIR"
else
    log "ℹ️ Root token not found, skipping policy writes"
fi

# Login with setup AppRole to bootstrap
login_with_approle "$VAULT_KEYS_DIR/setup-role-id" "$VAULT_KEYS_DIR/setup-secret-id"

# Create all AppRoles
create_approle "healthcheck" "healthcheck-policy" "$VAULT_KEYS_DIR"
create_approle "nginx" "nginx-policy" "$NGINX_KEYS_DIR"
create_approle "app" "app-policy" "$APP_KEYS_DIR"

# Enable KV secrets
enable_kv_secrets

# Populate secrets
populate_jwt_secret
populate_google_secret

# SSL setup
setup_ssl_ca

# Revoke bootstrap token
vault token revoke -self
cleanup_sensitive_vars
log "🔒" "Bootstrap token revoked"

wait $VAULT_PID
