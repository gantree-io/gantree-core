const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: SystemAccount } = require('../system-account')


const extract = createExtractor('binary-chain', props => {
  const { gco } = props
  const { binary = {} } = gco

  if (binary.chain) {
    return { chain: binary.chain }
  }

  const use_bin_spec = binary.use_bin_chain_spec || binary.useBinChainSpec || false

  if (use_bin_spec) {
    return { chain: null }
  }

  const { substrate_user } = SystemAccount.node(props)

  return {
    chain: `/home/${substrate_user}/tmp/gantree-validator/spec/chainSpecRaw.raw`
  }
})

module.exports = {
  extract
}
