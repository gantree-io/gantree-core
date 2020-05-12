const StdJson = require('./utils/std-json')
const {
  GantreeError,
  ErrorTypes: { MISSING_ARGUMENTS, BAD_CONFIG }
} = require('./gantree-error')

const libV2 = require('./v2/core/core')

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

  return StdJson.read(config_path)
}

const get_config_version = gco => {
  return (
    (gco.metadata && gco.metadata.version && gco.metadata.version.toString()) ||
    '2'
  )
}

const get_project_name = gco => {
  const project_name = gco.metadata && gco.metadata.project
  if (!project_name) {
    throw new GantreeError(
      BAD_CONFIG,
      'Config requires |.metadata.project field'
    )
  }
  return project_name
}

const run = async (args = {}) => {
  const gco = get_gco(args)
  const config_version = get_config_version(gco)
  const project_name = get_project_name(gco)

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

  gLib.run({ ...args, gco, project_name })
}

module.exports = {
  run
}
