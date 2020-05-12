const provider_env_vars = require('../../static_data/provider_env_vars')
const {
  GantreeError,
  ErrorTypes: { MISSING_ARGUMENTS, ENVIRONMENT_VARIABLE_MISSING, BAD_CONFIG }
} = require('../../gantree-error')
const { returnLogger } = require('../logging')

const logger = returnLogger('envVars')

function envVars(gco) {
  if (gco === undefined) {
    throw new GantreeError(
      MISSING_ARGUMENTS,
      'envVars requires a gantree config object'
    )
  }

  for (const node of gco.nodes) {
    const provider = node && node.instance && node.instance.provider
    const env_vars = provider_env_vars[provider]
    if (!env_vars) {
      logger.error(`Incompatible provider: ${provider}`)
      throw new GantreeError(BAD_CONFIG, `Incompatible provider: ${provider}`)
    }

    for (const ev of env_vars) {
      if (!(ev in process.env)) {
        logger.error(`Required environment variable not found: ${ev.name}`)
        throw new GantreeError(
          ENVIRONMENT_VARIABLE_MISSING,
          `Required environment variable not found: ${ev.name}`
        )
      }
    }
  }
}

module.exports = {
  envVars
}
