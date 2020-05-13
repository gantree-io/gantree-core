const Ansible = require('../../ansible')
const Inventory = require('../../inventory')
const {
  GantreeError,
  ErrorTypes: { MISSING_NAMESPACE_ITEM }
} = require('../../../gantree-error')
const { returnLogger } = require('../../services/logging')
const pathHelpers = require('../../../utils/path-helpers')

const clean = async (frame, gco) => {
  const logger = returnLogger('lib/gantree/clean')

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

    logger.warn('nothing to clean')
    return
  }

  await Inventory.createInventory(frame, gco)

  const infra_playbook_filepath = pathHelpers.getPlaybookFilePath(
    'clean_infra.yml'
  )

  await Ansible.commands.runPlaybook(
    frame,
    [frame.active_path],
    infra_playbook_filepath
  )

  // delete gantree inventory
  Inventory.deleteGantreeInventory(frame)

  logger.info('clean finished')
}

module.exports = {
  clean
}
