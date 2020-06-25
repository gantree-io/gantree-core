const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: SystemAccounts } = require('../system-account')
const { extract: Misc } = require('../misc')
const { extract: BinaryFilename } = require('./binary-filename')


const extract = createExtractor('binary-node-key-file', props => {
  const { gco, nco } = props

  const { substrate_user } = SystemAccounts.node(props)
  const { binary_filename } = BinaryFilename.node(props)
  const { substrate_network_id } = Misc.node(props)
  const node_key_file = `/home/${substrate_user}/.local/share/${binary_filename}/chains/${substrate_network_id}/network/secret_ed25519`

  return {
    node_key_file
  }
})


module.exports = {
  extract
}
