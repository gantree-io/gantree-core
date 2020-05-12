const { Ansible } = require('../ansible')
const path = require('path') // TODO: remove import once active path fixed
const {
  GantreeError,
  ErrorTypes: { MISSING_NAMESPACE_ITEM }
} = require('../../gantree-error')
const { returnLogger } = require('../services/logging')
const pathHelpers = require('../../utils/path-helpers')

const clean = async (frame, gco) => {
  const logger = returnLogger('lib/gantree/clean')
  const ansible = new Ansible()
  // TODO: FIX: must be refactored to not reuse so much code from sync, this is a temp fix
  // TODO: implement strict flag in CLI and also document for lib and CLI

  const projectPath = frame.project_path

  await ansible.inventory.namespace.create(frame) // create project path recursively

  const gantreeInventoryExists = await ansible.inventory.gantreeInventoryExists(
    projectPath
  )

  if (gantreeInventoryExists === false) {
    // NOTE(ryan): why can't we create the inventory and then clean it?
    if (frame.strict === true) {
      throw new GantreeError(
        MISSING_NAMESPACE_ITEM,
        "Can not clean Gantree inventory that doesn't exist"
      )
    }

    logger.warn('nothing to clean')
    process.exit(0)
  }

  // create inventory for inventory/{NAMESPACE}/gantree
  await ansible.inventory.createInventory(frame, gco)
  const gantreeInventoryPath = frame.inventory_path

  // TODO: TEMPorary, should be output of this.ansible.inventory.createActiveInventory
  const activeInventoryPath = path.join(projectPath, 'active')

  // create inventories for inventory/{NAMESPACE}/active
  // const activeInventoryPath = inventory.createActiveInventories(gantreeConfigObj, projectPath)

  const inventoryPathArray = [gantreeInventoryPath, activeInventoryPath]

  // create infra using inventories
  const infraPlaybookFilePath = pathHelpers.getPlaybookFilePath(
    'clean_infra.yml'
  )

  await ansible.commands.runPlaybook(inventoryPathArray, infraPlaybookFilePath)

  // delete gantree inventory
  ansible.inventory.deleteGantreeInventory(frame, projectPath)

  logger.info('clean finished')
}

module.exports = {
  clean
}
