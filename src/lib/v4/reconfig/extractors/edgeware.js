const { createExtractor } = require('../creators/create-extractor')

const extract = createExtractor('edgeware', ({ gco }) => ({
  edgeware: gco.binary.edgeware || 'false' // TODO(ryan): remove this special case once edgeware spec is fixed
}))

module.exports = {
  extract
}
