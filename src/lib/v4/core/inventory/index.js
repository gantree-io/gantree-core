
const namespace = require('./namespace')
const IpAddresses = require('./ip-addresses')
const { activateProviders } = require('./activate-providers')
const { createInventory, deleteGantreeInventory, gantreeInventoryExists } = require('./manage-inventory')


module.exports = {
  namespace,
  IpAddresses,
  activateProviders,
  createInventory,
  deleteGantreeInventory,
  gantreeInventoryExists
}
