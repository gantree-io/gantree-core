const Ansible = require('../../ansible')
const Inventory = require('../../inventory')
const stdout = require('../../../utils/stdout')
const pathHelpers = require('../../../utils/path-helpers')

const sync = async (frame, gco) => {
  const logger = frame.logAt('core/sync')

  await Inventory.namespace.create(frame) // create project path recursively

  await Inventory.createInventory(frame, gco)

  // TODO: TEMPorary, should be output of this.ansible.inventory.createActiveInventory

  const inventory_path_array = [frame.active_path]

  // setup infra
  const infra_playbook_filepath = pathHelpers.getPlaybookFilePath('infra.yml')
  await Ansible.commands.runPlaybook(
    frame,
    inventory_path_array,
    infra_playbook_filepath
  )

  // // get instance IPs using inventories
  const combined_inventory = await Ansible.commands.returnCombinedInventory(
    frame,
    inventory_path_array
  )
  const nodeIpAddresses = await Ansible.extract.IPs(frame, combined_inventory)

  await stdout.writeForParsing(
    'NODE_IP_ADDRESSES',
    JSON.stringify(nodeIpAddresses)
  )

  // convert instances into substrate nodes
  const operation_playbook_filepath = pathHelpers.getPlaybookFilePath(
    'operation.yml'
  )
  await Ansible.commands.runPlaybook(
    frame,
    inventory_path_array,
    operation_playbook_filepath
  )

  logger.info('sync finished')
}

module.exports = {
  sync
}
