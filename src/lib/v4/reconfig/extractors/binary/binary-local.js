const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')


const extract = createExtractor('binary-local', ({ gco }) => {
  const { binary: { local } = {} } = gco

  if (!local) {
    return null
  }

  return {
    substrate_binary_path: local.path || 'false' // TODO: not yet implemented
  }
})


module.exports = {
  extract
}
