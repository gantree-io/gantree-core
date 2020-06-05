
const path = require('path')
const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: SystemAccount } = require('../system-account')
const { extract: SodeNames } = require('../sode/sode-names')


const extract = createExtractor('binary-chain', props => {
  const { gco } = props
  const { binary = {} } = gco

  const { system_home } = SystemAccount.node(props)
  const { binary_name } = SodeNames.node(props)

  const chain_build_spec_path = path.join(system_home, `/tmp/gantree-validator/spec/chainSpecRaw.raw`)
  const chain_dir = path.join(system_home, '.local/share', binary_name)
  const use_bin_spec = binary.use_bin_chain_spec || binary.useBinChainSpec || false

  if (binary.chain) {
    return {
      chain_dir,
      chain: binary.chain,
      sb_build_spec: false
    }
  }

  if (use_bin_spec) {
    return {
      chain_dir,
      chain: null,
      sb_build_spec: false
    }
  }

  return {
    chain_dir,
    chain: chain_build_spec_path,
    sb_build_spec: true,
  }
})


module.exports = {
  extract
}
