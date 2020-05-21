const cloneDeepWith = require('lodash.clonedeepwith')
const {
  GantreeError,
  ErrorTypes: { ENVIRONMENT_VARIABLE_MISSING }
} = require('../../../error/gantree-error')
const { hasOwnProp } = require('../../../utils/has-own-prop')

const envRegex = /(?<=^\$(env|ENV):)[A-Za-z_]+(?=$)/

function dynamicEnvVarCustomizer(value) {
  if (typeof value !== 'string') {
    return
  }

  const match = value.match(envRegex)
  if (!match) {
    return
  }

  const exists = hasOwnProp(process.env, match[0])
  if (exists) {
    return process.env[match[0]]
  }

  throw new GantreeError(
    ENVIRONMENT_VARIABLE_MISSING,
    `Failed to resolve reference in Gantree config: '${value}'`
  )
}

function processor(procProps) {
  const logger = procProps.frame.logAt('v2/processor/inject-env-vars')
  logger.info('injecting environment variables into config')

  return cloneDeepWith(procProps.gco, dynamicEnvVarCustomizer)
}

module.exports = {
  processor
}
