const { createExtractor } = require('../creators/create-extractor')

const extract = createExtractor('name', ({ gco, nco, index }) => {
  const name = nco.name || (gco.metadata && gco.metadata.project) + '-' + index

  return {
    name
  }
})

module.exports = {
  extract
}
