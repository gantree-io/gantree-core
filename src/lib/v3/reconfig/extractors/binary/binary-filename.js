const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')


const extract = createExtractor('binary-filename', props => {
  const {
    gco: { binary }
  } = props

  if (!binary) {
    throw new GantreeError(BAD_CONFIG, 'need |.binary')
  }

  if (!binary.filename) {
    throw new GantreeError(BAD_CONFIG, 'need |.binary.filename')
  }

  return {
    sb_bin_filename: binary.filename,
  }
})

module.exports = {
  extract
}
