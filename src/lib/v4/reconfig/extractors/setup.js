const { createExtractor } = require('../creators/create-extractor')

const { extract: Ansible } = require('./ansible')
const { extract: IpAddress } = require('./ip-address')
const { extract: InventoryGroup } = require('./inventory-group')

const extract = createExtractor('setup', (props) => {
  const { base, frame, logger } = props

  return {
    ...Ansible.node(props),
    ...IpAddress.node(props),
    ...InventoryGroup.node(props)
  }
})

module.exports = {
  extract
}
