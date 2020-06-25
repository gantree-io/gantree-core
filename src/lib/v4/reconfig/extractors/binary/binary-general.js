const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: BinaryRepository } = require('./binary-repository')


const extract = createExtractor('binary-general', props => {
  const {
    gco: { binary }
  } = props

  if (!binary) {
    throw new GantreeError(BAD_CONFIG, 'need |.binary')
  }

  const repo = BinaryRepository.node(props)

  if (!binary.filename) {
    throw new GantreeError(BAD_CONFIG, 'need |.binary.filename')
  }

  return {
    substrate_bin_name: binary.filename,
    substrate_chain_argument: binary.chain || 'false',
    substrate_use_default_spec:
      binary.use_bin_chain_spec || binary.useBinChainSpec || 'false',
    substrate_local_compile:
      (repo && (repo.local_compile || repo.localCompile)) || 'false',
    substrate_bootnode_argument: binary.bootnodes || [],
    substrate_purge_chain: 'true'
  }
})

module.exports = {
  extract
}
