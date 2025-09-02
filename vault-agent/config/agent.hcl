vault {
  address = "https://vault:8200"
  ca_cert = "/vault/ca/root-ca.crt"
}

auto_auth {
  method "approle" {
    config = {
      role_id_file_path   = "/vault/secrets/nginx_role_id"
      secret_id_file_path = "/vault/secrets/nginx_secret_id"
    }
  }
  sink "file" {
    config = {
      path = "/vault/token"
    }
  }
}

template_config {
  static_secret_render_interval = "10m"
  max_connections_per_host = 20
  lease_renewal_threshold = 0.9
}

template {
  source      = "/vault/templates/cert.ctmpl"
  destination = "/vault/certs/fullchain.pem"
}

template {
  source      = "/vault/templates/key.ctmpl"
  destination = "/vault/certs/key.pem"
}
