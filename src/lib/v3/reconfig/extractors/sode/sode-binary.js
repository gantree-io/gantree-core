const path = require('path')
const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: SodeNames } = require('./sode-names')
const { extract: BinaryFilename } = require('../binary/binary-filename')
const { extract: GantreeExtractor } = require('../gantree')


const BinaryRustBuild = createExtractor('binary-repository', props => {
  const { gco } = props
  const { binary: { repository: r } = {} } = gco

  if (!r) {
    return null
  }

  if (!r.url) {
    throw new GantreeError(BAD_CONFIG, '|.binary.repository must contain .url')
  }

  const { binary_filename } = BinaryFilename.node(props)
  const src_subfolder = r.src_subfolder || r.srcSubfolder || ''

  // TODO: auto inject --no-self-update on 'update commands'
  // as updating without it can fail due to .cargo path issues
  const rustup = r.rustup || [
    "default stable",
    "update --no-self-update nightly",
    "target add wasm32-unknown-unknown --toolchain nightly"
  ]

  const { gantree_working } = GantreeExtractor.node(props)
  const build_path = path.join(gantree_working, 'build', 'sode-src')
  const output_subfolder = path.join(r.output_subfolder || r.outputSubfolder || 'target/debug')

  return {
    rust_build: {
      repository_url: r.url,
      repository_version: r.version || 'HEAD',
      binary_filename,
      build_path,
      src_subfolder,
      apt_requirements: [],
      compile_path: output_subfolder,
      rustup
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

  return {
    sode_binary: {
      ...BinaryFetch.node(props),
      ...BinaryRustBuild.node(props),
      ...SodeNames.node(props)
    }
  }
})


module.exports = {
  extract
}
