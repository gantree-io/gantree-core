const Ansible = require('../ansible')
const Inventory = require('../inventory')
const {
  GantreeError,
  ErrorTypes: { MISSING_NAMESPACE_ITEM }
} = require('../../../error/gantree-error')

const clean = async (frame, gco) => {
  const logger = frame.logAt('lib/gantree/clean')

  await Inventory.namespace.create(frame) // create project path recursively

  const gantreeInventoryExists = await Inventory.gantreeInventoryExists(frame)

  if (gantreeInventoryExists === false) {
    // NOTE(ryan): why can't we create the inventory and then clean it?
    if (frame.strict === true) {
      throw new GantreeError(
        MISSING_NAMESPACE_ITEM,
        "Can not clean Gantree inventory that doesn't exist"
      )
    }

    logger.warning('nothing to clean')
    return
  }

  await Inventory.createInventory(frame, gco)

  await Ansible.commands.runPlaybook(frame, 'clean_infra.yml')

  // delete gantree inventory
  Inventory.deleteGantreeInventory(frame)

  logger.info('clean finished')
}

module.exports = {
  clean
}
