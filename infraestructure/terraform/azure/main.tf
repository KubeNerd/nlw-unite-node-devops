provider "azurerm" {
  skip_provider_registration = true 
  subscription_id = var.azure_subscription_id
  client_id       = var.azure_client_id
  client_secret   = var.azure_client_secret
  tenant_id       = var.azure_tenant_id
  features {}
}

resource "azurerm_network_security_group" "nsg-nlwunite" {
  name                = "nlwunite-nsg"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  security_rule {
    name                       = "test123"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = {
    environment = "nlwunite-nsg"
  }
}


resource "azurerm_postgresql_server" "db-server" {
  name                = "postgresql-nlwunite"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  sku_name = "B_Gen5_1"

  storage_mb                   = 5120
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  administrator_login          =  var.database_administrator
  administrator_login_password = var.database_password
  
  version                      = "10.0"
  ssl_enforcement_enabled      = true
  public_network_access_enabled = true
}

resource "azurerm_postgresql_configuration" "db-server-config" {
  name                = "backslash_quote"
  resource_group_name = azurerm_resource_group.rg.name
  server_name         = azurerm_postgresql_server.db-server.name
  value               = "on"

}