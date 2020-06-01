const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')


const extract = createExtractor('binary-fetch', ({ gco }) => {
  const { binary: { fetch } = {} } = gco

  /*if (!fetch) {
    return null
  }*/

  return {
    substrate_binary_url: (fetch && fetch.url) || 'false',
    substrate_binary_sha256: (fetch && fetch.sha256) || 'false'
  }
})


module.exports = {
  extract
}
