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
    '2' // NOTE(Denver): this default differs from run() switch case default
  )
}

const run = async (args = {}) => {
  const gco = get_gco(args)
  const config_version = get_config_version(gco)

  if (!args.logger) {
    throw new GantreeError(
      MISSING_ARGUMENTS,
      "Must supply 'Logger'" // TODO(Denver): there should be a default logger if none specified (lib)
    )
  }
  let gLib = null
  switch (config_version) {
  case '2.0':
    args.logger.notice(
      "Config point versions deprecated, use '2' rather than '2.0'"
    )
    args.logger.info('Matched config version: 2')
    gLib = libV2
    break
  case '2':
    args.logger.info('Matched config version: 2')
    gLib = libV2
    break
  case '3':
    args.logger.info('Matched config version: 3')
    gLib = libV3
    break
  default:
    args.logger.warning(
      `Unsupported config version '${config_version}', using '3'` // NOTE(Denver): this default differs from get_config_version default
    )
    gLib = libV3
    break
  }

  gLib.run({ ...args, gco })
}

module.exports = {
  run
}
