const StdJson = require('./utils/std-json')
const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('./gantree-error')

const libV2 = require('./v2/core/core')

const get_gco = args => {
  const { config, config_path } = args
  if (config && config_path) {
    throw new GantreeError(
      BAD_CONFIG,
      "Cannot supply both 'config' and 'config_path'"
    )
  }

  if (!config && !config_path) {
    throw new GantreeError(
      BAD_CONFIG,
      "Must supply either 'config' or 'config_path'"
    )
  }

  if (config) {
    return config
  }

  return StdJson.read(config_path)
}

const get_config_version = gco => {
  return (
    (gco.metadata && gco.metadata.version && gco.metadata.version.toString()) ||
    '2'
  )
}

const run = async (args = {}) => {
  const gco = get_gco(args)
  const config_version = get_config_version(gco)

  let gLib = null
  switch (config_version) {
  case '2':
    gLib = libV2
    break
  default:
    // TODO(ryan): log to job
    console.log(`Unsupported config version '${config_version}', using '2'`)
    gLib = libV2
    break
  }

  gLib.run({ ...args, gco })
}

module.exports = {
  run
}
