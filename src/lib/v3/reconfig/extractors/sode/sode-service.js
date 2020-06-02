const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: BinaryArguments } = require('../binary/binary-arguments')
const { extract: SodeBinaryName } = require('./sode-binary-name')


const extract = createExtractor('sode-service', props => {
  const { gco, nco } = props

  const { binary_name } = SodeBinaryName.node(props)
  const { sb_binary_arguments } = BinaryArguments.node(props)

  return {
    sode_service: {
      binary_arguments: sb_binary_arguments,
      binary_name,
      service_name: binary_name
    }
  }
})


module.exports = {
  extract
}
