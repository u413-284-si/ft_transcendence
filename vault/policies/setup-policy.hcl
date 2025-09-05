# Allow AppRole auth method enable + role management
path "sys/auth" {
  capabilities = ["read", "list"]
}

# Allow enabling/disabling the AppRole auth method
path "sys/auth/approle" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# Full control over AppRole roles (create, read, update, delete, list)
path "auth/approle/role/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

path "sys/mounts" {
  capabilities = ["read", "list"]
}

# Manage the KV secrets mount (enable/disable)
path "sys/mounts/secret" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# # Read/write/delete app/nginx secrets
path "secret/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# Manage PKI mounts (enable/disable)
path "sys/mounts/pki" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
path "sys/mounts/pki_int" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# Tune PKI mounts (TTL, description, etc.)
path "sys/mounts/pki/tune" {
  capabilities = ["update", "read"]
}
path "sys/mounts/pki_int/tune" {
  capabilities = ["update", "read"]
}

# Full access to PKI backends for bootstrap setup
path "pki/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
path "pki_int/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# Allow revoking own token
path "auth/token/revoke-self" {
  capabilities = ["update"]
}
