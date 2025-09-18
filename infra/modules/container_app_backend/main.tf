resource "azurerm_container_app" "this" {
  name                         = var.name
  resource_group_name          = var.resource_group_name
  container_app_environment_id = var.environment_id
  revision_mode                = "Single"
  tags                         = var.tags

  ingress {
    external_enabled = true
    target_port      = 80
    transport        = "auto"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  secret {
    name  = "acr-pwd"
    value = var.registry_password
  }

  secret {
    name  = "func-storage"
    value = var.azurewebjobsstorage
  }

  registry {
    server               = var.registry_server
    username             = var.registry_username
    password_secret_name = "acr-pwd"
  }

  template {
    container {
      name   = "${var.name}-c"
      image  = var.image
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name        = "AzureWebJobsStorage"
        secret_name = "func-storage"
      }
    }

    min_replicas = 1
    max_replicas = 1
  }
}
