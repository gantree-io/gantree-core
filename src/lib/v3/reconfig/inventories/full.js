const { inventory: inventoryInfra } = require('./infra')
const { inventory: inventoryOperation } = require('./operation')

const inventory = invProps => {
  const infra = inventoryInfra(invProps)
  const operation = inventoryOperation(invProps)

  // TODO(ryan): avoid collisions here
  const full = {
    ...operation,
    ...infra
  }

  return full
}

module.exports = {
  inventory
}
