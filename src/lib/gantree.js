const StdJson = require('./utils/std-json')
const {
  GantreeError,
  ErrorTypes: { MISSING_ARGUMENTS, BAD_CONFIG }
} = require('./error/gantree-error')

const libV2 = require('./v2/core/core')
const libV3 = require('./v3/core/core')

const get_gco = args => {
  const { config_object, config_path } = args
  if (config_object && config_path) {
    throw new GantreeError(
      MISSING_ARGUMENTS,
      "Cannot supply both 'config_object' and 'config_path'"
    )
  }

  if (!config_object && !config_path) {
    throw new GantreeError(
      MISSING_ARGUMENTS,
      "Must supply either 'config_object' or 'config_path'"
    )
  }

  if (config_object) {
    return config_object
  }

  try {
    return StdJson.read(config_path)
  } catch (e) {
    throw new GantreeError(BAD_CONFIG, `Failed to parse config`, e)
  }
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
      args.logger.info('Matched config version: 2')
      gLib = libV2
      break
    case '3':
      args.logger.info('Matched config version: 3')
      gLib = libV3
      break
    default:
      args.logger.warn(
        `Unsupported config version '${config_version}', using '2'`
      )
      gLib = libV2
      break
  }

  gLib.run({ ...args, gco })
}

module.exports = {
  run
}
