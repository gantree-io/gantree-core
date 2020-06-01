const { extract: InfraExtractor } = require('../extractors/infra')
const { inventory: skeleton_inventory } = require('./skeleton')

const inventory = invProps => {
  const { gco, frame } = invProps

  const inv = skeleton_inventory(invProps)

  const infraData = InfraExtractor.all({ gco, frame }).map(x => x.infra)
  //(nco, index) => InfraExtractor..infra
  //)

  inv._meta.hostvars.localhost = {
    infra: infraData
  }

  return inv
}

module.exports = {
  inventory
}
