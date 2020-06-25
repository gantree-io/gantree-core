const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: BinaryArguments } = require('../binary/binary-arguments')
const { extract: SodeNames } = require('./sode-names')


const extract = createExtractor('sode-service', props => {

  const { sb_binary_arguments } = BinaryArguments.node(props)

  return {
    sode_service: {
      binary_arguments: sb_binary_arguments,
      ...SodeNames.node(props)
    }
  }
})


module.exports = {
  extract
}
