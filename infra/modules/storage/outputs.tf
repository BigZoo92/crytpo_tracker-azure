output "connection_string" {
  value     = azurerm_storage_account.this.primary_connection_string
  sensitive = true
}

output "name" {
  value = azurerm_storage_account.this.name
}
