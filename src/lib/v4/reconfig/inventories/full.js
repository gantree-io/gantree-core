
const merge = require('lodash.merge')
const { inventory: inventoryInfra } = require('./infra')
const { inventory: inventoryOperation } = require('./operation')

const inventory = invProps => {
  const infra = inventoryInfra(invProps)
  const operation = inventoryOperation(invProps)

  // TODO(ryan): catch collisions here
  const full = merge(operation, infra)

  return full
}

module.exports = {
  inventory
}
