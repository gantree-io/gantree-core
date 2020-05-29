const { createExtractor } = require('./create-extractor')

const { extract: Infra } = require('./infra')

const extract = createExtractor('inventory-group', props => {
  const { infra } = Infra.node(props)

  return {
    inventory_group: infra.group_name
  }
})

module.exports = {
  extract
}
