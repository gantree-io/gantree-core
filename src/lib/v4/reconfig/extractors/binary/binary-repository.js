const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')


const extract = createExtractor('binary-repository', ({ gco }) => {
  const { binary: { repository } = {} } = gco

  if (!repository) {
    return null
  }

  if (!repository.url) {
    throw new GantreeError(BAD_CONFIG, '|.binary.repository must contain .url')
  }

  return {
    substrate_repository_url: repository.url,
    substrate_repository_version: repository.version || 'HEAD'
  }
})


module.exports = {
  extract
}
