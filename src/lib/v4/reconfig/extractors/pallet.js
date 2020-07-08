const { createExtractor } = require('../creators/create-extractor')

const { extract: Infra } = require('./infra')

const extract = createExtractor('pallet', props => {
  const { infra } = Infra.node(props)

  return {
    inventory_group: infra.group_name
  }
})

module.exports = {
  extract
}
