resource "azurerm_container_registry" "this" {
  name                = var.name
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = true # rapide pour POC; on passera en managed identity après si besoin
  tags                = var.tags
}
