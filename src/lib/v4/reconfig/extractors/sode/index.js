const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: SodeService } = require('./sode-service')
const { extract: SodeBinary } = require('./sode-binary')
const { extract: SodeRestart } = require('./sode-restart')
const { extract: SodeNames } = require('./sode-names')
const { extract: BinaryChain } = require('../binary/binary-chain')
const { extract: BinaryNodeKeyFile } = require('../binary/binary-node-key-file')


const extract = createExtractor('binary', props => {
  return {
    sode: {
      ...SodeService.node(props),
      ...SodeBinary.node(props),
      ...SodeRestart.node(props),
      ...SodeNames.node(props),
      ...BinaryChain.node(props),
      ...BinaryNodeKeyFile.node(props)
    }
  }
})


module.exports = {
  extract
}
