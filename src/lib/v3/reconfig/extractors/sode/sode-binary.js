const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: SodeBinaryName } = require('./sode-binary-name')
const { extract: BinaryFilename } = require('../binary/binary-filename')


const BinaryRustBuild = createExtractor('binary-repository', ({ gco }) => {
  const { binary: { repository: r } = {} } = gco

  if (!r) {
    return null
  }

  if (!r.url) {
    throw new GantreeError(BAD_CONFIG, '|.binary.repository must contain .url')
  }

  const { binary_filename } = BinaryFilename.node(props)
  const src_subfolder = r.src_subfolder || r.srcSubfolder || ''

  return {
    rust_build: {
      repository_url: repository.url,
      repository_version: repository.version || 'HEAD',
      binary_filename,
      src_folder: 'sode_src',
      src_subfolder,

    }
  }
})

const BinaryFetch = createExtractor('binary-fetch', ({ gco }) => {
  const { binary: { fetch } = {} } = gco

  if (!fetch) {
    return null
  }

  return {
    fetch: {
      url: (fetch && fetch.url) || 'false',
      sha256: (fetch && fetch.sha256) || 'false'
    }
  }
})

const extract = createExtractor('binary-arguments', props => {
  const { gco, nco } = props

  const { binary_name } = SodeBinaryName.node(props)

  return {
    sode_binary: {
      ...BinaryFetch.node(props),
      ...BinaryRustBuild.node(props),
      binary_name,
      service_name: binary_name
    }
  }
})


module.exports = {
  extract
}
