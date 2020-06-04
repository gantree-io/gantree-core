const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: BinaryChain } = require('../binary/binary-chain')
const { extract: SodeBinaryName } = require('./sode-binary-name')
const { extract: SystemAccount } = require('../system-account')


const extract = createExtractor('sode-service', props => {
  const { gco, nco } = props

  const { binary_name } = SodeBinaryName.node(props)
  const { chain } = BinaryChain.node(props)
  const { substrate_user } = SystemAccount.node(props)

  return {
    sode_restart: {
      restart: 'true',
      chain,
      chain_dir: `/home/${substrate_user}/.local/share/${binary_name}`,
      binary_name,
      service_name: binary_name
    }
  }
})


module.exports = {
  extract
}
