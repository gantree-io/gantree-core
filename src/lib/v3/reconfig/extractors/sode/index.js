const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: SodeService } = require('./sode-service')
const { extract: SodeBinary } = require('./sode-binary')


const extract = createExtractor('binary', props => {
  return {
    sode: {
      ...SodeService.node(props),
      ...SodeBinary.node(props)
    }
  }
})


module.exports = {
  extract
}
