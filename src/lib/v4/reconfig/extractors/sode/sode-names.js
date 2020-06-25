const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: BinaryFilename } = require('../binary/binary-filename')

const extract = createExtractor('sode-names', props => ({
  binary_name: BinaryFilename.node(props).binary_filename,
  service_name: 'sode'
}))


module.exports = {
  extract
}
