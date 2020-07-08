const { createExtractor } = require('../creators/create-extractor')

const extract = createExtractor('name', ({ gco, nco, index }) => {
  const name = nco.name || (gco.metadata && gco.metadata.project) + '-' + index

  const snake_name = name.replace(/-/g, '_')

  return {
    name,
    snake_name,
  }
})

module.exports = {
  extract
}
