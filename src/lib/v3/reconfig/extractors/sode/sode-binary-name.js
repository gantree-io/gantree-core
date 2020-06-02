const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')


const extract = createExtractor('sode-binary-name', props => {
  const { gco, nco } = props

  return {
    binary_name: 'sode',
  }
})


module.exports = {
  extract
}
