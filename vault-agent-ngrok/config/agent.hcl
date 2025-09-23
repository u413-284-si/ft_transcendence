auto_auth {
  method "approle" {
    config = {
      role_id_file_path   = "/vault/secrets/ngrok/ngrok-role-id"
      secret_id_file_path = "/vault/secrets/ngrok/ngrok-secret-id"
      remove_secret_id_file_after_reading = false
    }
  }
  sink "file" {
    config = {
      path = "/vault/token"
    }
  }
}

template {
  source      = "/vault/templates/ngrok.yml.ctmpl"
  destination = "/etc/ngrok/ngrok.yml"
}
