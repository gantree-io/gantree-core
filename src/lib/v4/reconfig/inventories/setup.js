const { extract: SetupExtractor } = require('../extractors/setup')
const { inventory: skeleton_inventory } = require('./skeleton')

const inventory = invProps => {
  const { gco, frame } = invProps

  let inv = skeleton_inventory(invProps)

  const logger = frame.logAt('setup-inventory')

  const sode_data = SetupExtractor.all(invProps)

  const sode_definitions = getSodeDefinitions(sode_data)
  const group_definitions = getGroupDefinitions(sode_data)

  inv = { ...inv, ...group_definitions, ...sode_definitions }
  return inv
}

const getSodeDefinitions = sodes => {
  const definition = sode => ({ [sode.inventory_group]: { vars: sode, hosts: [sode.ip_address] } })

  return sodes.reduce(
    (defs, sode) => Object.assign({}, defs, definition(sode)),
    {}
  )
}

const getGroupDefinitions = sodes => {
  const new_group = () => ({ children: [] })

  let groups = {
    sode: new_group(),
  }

  sodes.forEach((sode, index) => {
    const { inventory_group } = sode

    // TODO: throw error on inventory_group collision
    groups = { ...groups, ...{ [inventory_group]: sode } }

    groups.sode.children.push(inventory_group)
  })

  return groups
}

module.exports = {
  inventory
}
