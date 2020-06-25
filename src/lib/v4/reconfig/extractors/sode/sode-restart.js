const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: BinaryChain } = require('../binary/binary-chain')
const { extract: SodeNames } = require('./sode-names')
const { extract: SystemAccount } = require('../system-account')


const extract = createExtractor('sode-service', props => {

  return {
    sode_restart: {
      restart: 'true',
      ...BinaryChain.node(props),
      ...SodeNames.node(props)
    }
  }
})


module.exports = {
  extract
}
