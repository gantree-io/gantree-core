
const namespace = require('./namespace')
const { activateProviders } = require('./activate-providers')
const { createInventory, deleteGantreeInventory, gantreeInventoryExists } = require('./manage-inventory')


module.exports = {
  namespace,
  activateProviders,
  createInventory,
  deleteGantreeInventory,
  gantreeInventoryExists
}
