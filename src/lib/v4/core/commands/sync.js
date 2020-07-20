const Ansible = require('../ansible')
const Inventory = require('../inventory')
const StdJson = require('../../../utils/std-json')
const stdout = require('../../../utils/stdout')


const extract_hostname_ip_pairs = overtory_data => {
  const pairs = overtory_data._meta.hostvars.validator.children.map(hostname => {
    const ip_address = overtory_data._meta.hostvars[hostname].vars.ip_address
    return {
      hostname,
      ip_address
    }
  })

  return { pairs }
}

const sync = async (frame, gco) => {
  const logger = frame.logAt('core/sync')
  logger.info('sync starting')

  await Inventory.namespace.create(frame) // create project path recursively

  Inventory.activateProviders(frame, gco)

  await Inventory.createInventory(frame, gco, 'full')

  // TODO: TEMPorary, should be output of this.ansible.inventory.createActiveInventory

  // setup infra
  await Ansible.runPlaybook(frame, 'infra.yml')

  // // get instance IPs using inventories
  const overtory_data = await Ansible.returnOvertoryDirect(
    frame
  )

  logger.debug(overtory_data)
  const node_ip_addresses = overtory_data.gantree_special.vars.hostname_ip_pairs

  await stdout.writeForParsing(
    'NODE_IP_ADDRESSES',
    JSON.stringify(node_ip_addresses)
  )

  // convert instances into substrate nodes
  await Ansible.runPlaybook(frame, 'operation.yml')

  logger.info('sync finished')
}

module.exports = {
  sync
}
