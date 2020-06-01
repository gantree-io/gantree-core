const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: System } = require('../system-account')


const extract = createExtractor('binary-options', props => {
  const { nco } = props
  const { substrate_user } = System.node(props)

  const bo = nco.binary_options || nco.binaryOptions || {}

  return {
    substrate_chain: `/home/${substrate_user}/tmp/gantree-validator/spec/chainSpecRaw.raw`,
    substrate_options: bo.substrate_options || bo.substrateOptions || [],
    substrate_rpc_port: bo.rpc_port || bo.rpcPort || 9933,
    substrate_node_name: bo.name || 'false',
    ...(bo.mnemonic && { substrate_mnemonic: bo.mnemonic })
  }
})


module.exports = {
  extract
}
