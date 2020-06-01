const { createExtractor } = require('../creators/create-extractor')

const { extract: Ansible } = require('./ansible')
const { extract: Binary } = require('./binary')
const { extract: Edgeware } = require('./edgeware')
const { extract: Gantree } = require('./gantree')
const { extract: InventoryGroup } = require('./inventory-group')
const { extract: Metadata } = require('./metadata')
const { extract: Misc } = require('./misc')
const { extract: InstanceName } = require('./instance-name')
const { extract: SystemAccount } = require('./system-account')
const { extract: Telemetry } = require('./telemetry')

const extract = createExtractor('operation', props => {
  return {
    ...Ansible.node(props),
    ...Binary.node(props),
    ...Edgeware.node(props),
    ...Gantree.node(props),
    ...Metadata.node(props),
    ...Misc.node(props),
    ...InstanceName.node(props),
    ...Telemetry.node(props),
    ...SystemAccount.node(props),
    ...InventoryGroup.node(props)
  }
})

module.exports = {
  extract
}
