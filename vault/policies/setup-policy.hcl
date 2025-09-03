# Allow managing mounts (enable/disable secrets engines)
path "sys/mounts/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
path "sys/mounts" {
  capabilities = ["read", "list"]
}

# Allow managing policies
path "sys/policies/acl/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# Allow AppRole auth method enable + role management
path "sys/auth/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
path "sys/auth" {
  capabilities = ["read", "list"]
}
path "auth/approle/role/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# Allow writing app/nginx secrets
path "secret/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# Manage PKI mounts (root and intermediate)
path "sys/mounts/pki" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
path "sys/mounts/pki_int" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# Full access to PKI backend for setup
path "pki/*" {
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
path "pki_int/*" {
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}

# Manage auth backends (e.g., approle)
path "sys/auth/*" {
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
path "sys/auth" {
  capabilities = ["read", "list"]
}

# Allow managing AppRole roles
path "auth/approle/role/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# Allow revoking own token
path "auth/token/revoke-self" {
  capabilities = ["update"]
}
