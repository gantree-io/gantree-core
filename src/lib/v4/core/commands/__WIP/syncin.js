const Ansible = require('../ansible')
const Inventory = require('../inventory')
const StdJson = require('../../../utils/std-json')
const stdout = require('../../../utils/stdout')

const sync = async (frame, gco) => {
  const logger = frame.logAt('core/sync')

  await Inventory.namespace.create(frame) // create project path recursively

  Inventory.activateProviders(frame, gco)

  await Inventory.createInventory(frame, gco)

  // TODO: TEMPorary, should be output of this.ansible.inventory.createActiveInventory

  // setup infra
  await Ansible.commands.runPlaybook(frame, 'infra.yml')

  // // get instance IPs using inventories
  const combined_inventory = await Ansible.commands.returnOvertoryInventory(
    frame
  )

  logger.info(combined_inventory)

  const node_ip_addresses = await Ansible.extract.IPs(frame, combined_inventory)

  await stdout.writeForParsing(
    'NODE_IP_ADDRESSES',
    JSON.stringify(node_ip_addresses)
  )

  // convert instances into substrate nodes
  await Ansible.commands.runPlaybook(frame, 'operation.yml')

  logger.info('sync finished')
}

module.exports = {
  sync
}
