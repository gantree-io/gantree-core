const provider_env_vars = require('../../static_data/provider_env_vars')
const {
  GantreeError,
  ErrorTypes: { ENVIRONMENT_VARIABLE_MISSING, BAD_CONFIG }
} = require('../../../gantree-error')

function envVars(frame, gco) {
  const logger = frame.logAt('envVars')

  for (const node of gco.nodes) {
    const provider = node && node.instance && node.instance.provider
    const env_vars = provider_env_vars[provider]

    if (!env_vars) {
      const msg = `Incompatible provider: ${provider}`
      logger.error(msg)
      throw new GantreeError(BAD_CONFIG, msg)
    }

    for (const ev of env_vars) {
      if (!(ev in process.env)) {
        const msg = `Required environment variable not found: ${ev.name}`
        logger.error(msg)
        throw new GantreeError(ENVIRONMENT_VARIABLE_MISSING, msg)
      }
    }
  }
}

module.exports = {
  envVars
}
