const { Ansible } = require('../ansible')
const stdout = require('../../utils/stdout')
const path = require('path') // TODO: remove import once active path fixed
const pathHelpers = require('../../utils/path-helpers')

const sync = async (frame, gco) => {
  const logger = frame.logAt('lib/gantree/sync')
  const ansible = new Ansible()

  const projectPath = frame.project_path

  await ansible.inventory.namespace.create(frame, projectPath) // create project path recursively

  // TODO: must be refactored, also creates active inventory
  // create inventory for inventory/{NAMESPACE}/gantree
  await ansible.inventory.createInventory(frame, gco)
  const gantreeInventoryPath = frame.inventory_path

  // TODO: TEMPorary, should be output of this.ansible.inventory.createActiveInventory
  const activeInventoryPath = await path.join(projectPath, 'active')

  // create inventories for inventory/{NAMESPACE}/active
  // const activeInventoryPath = inventory.createActiveInventories(gantreeConfigObj, projectPath)

  const inventoryPathArray = [gantreeInventoryPath, activeInventoryPath]

  // create infra using inventories
  const infraPlaybookFilePath = pathHelpers.getPlaybookFilePath('infra.yml')
  await ansible.commands.runPlaybook(inventoryPathArray, infraPlaybookFilePath)

  // // get instance IPs using inventories
  const combinedInventoryObj = await ansible.commands.returnCombinedInventory(
    inventoryPathArray
  )
  const nodeIpAddresses = await ansible.extract.IPs(
    combinedInventoryObj,
    frame.options
  )

  await stdout.writeForParsing(
    'NODE_IP_ADDRESSES',
    JSON.stringify(nodeIpAddresses)
  )

  // convert instances into substrate nodes
  const operationPlaybookFilePath = pathHelpers.getPlaybookFilePath(
    'operation.yml'
  )
  await ansible.commands.runPlaybook(
    inventoryPathArray,
    operationPlaybookFilePath
  )

  logger.info('sync finished')
}

module.exports = {
  sync
}
