const { createExtractor } = require('../creators/create-extractor')

const extract = createExtractor('metadata', ({ gco, defaults }) => {
  const metadata_version = gco.metadata.version || defaults.metadata.version
  const project_name = gco.metadata.project

  return {
    metadata_version,
    project_name
  }
})

module.exports = {
  extract
}
