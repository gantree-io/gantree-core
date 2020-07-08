const { extract: OperationExtractor } = require('../extractors/operation')
const { extract: HostnameIpPairExtractor } = require('../extractors/hostname-ip-pair')
const { inventory: skeleton_inventory } = require('./skeleton')

const inventory = invProps => {
  const { frame, gco, base } = invProps
  const logger = frame.logAt('inventories|operation|inventory')

  let inv = skeleton_inventory(invProps)

  /*
  const sode_data = gco.nodes.map((_nco, index) =>
    OperationExtractor.node({ ...invProps, index })
  )
  */

  const sode_data = OperationExtractor.all(invProps)

  const hostname_ip_pairs = HostnameIpPairExtractor.all(invProps).map(o => o.hostname_ip_pair)

  const shared_definitions = {
    hostname_ip_pairs
  }

  const sode_definitions = getSodeDefinitions(sode_data)
  const group_definitions = getGroupDefinitions(sode_data)

  inv = { ...inv, ...group_definitions, ...sode_definitions, ...shared_definitions }
  return inv
}

const getSodeDefinitions = sodes => {
  const definition = sode => ({ [sode.inventory_group]: { vars: sode } })

  return sodes.reduce(
    (defs, sode) => Object.assign({}, defs, definition(sode)),
    {}
  )
}

const getGroupDefinitions = sodes => {
  const new_group = () => ({ children: [] })

  let groups = {
    validator: new_group(),
    builder_bin: new_group(),
    builder_spec: new_group(),
    builder_telemetry: new_group()
  }

  sodes.forEach((sode, index) => {
    const { inventory_group } = sode

    // TODO: throw error on inventory_group collision
    groups = { ...groups, ...{ [inventory_group]: sode } }

    groups.validator.children.push(inventory_group)

    if (index === 0) {
      groups.builder_bin.children.push(inventory_group)
      groups.builder_spec.children.push(inventory_group)
      groups.builder_telemetry.children.push(inventory_group)
    }
  })

  return groups
}

module.exports = {
  inventory
}
