const cloneDeepWith = require('lodash.clonedeepwith')
const {
  GantreeError,
  ErrorTypes: { ENVIRONMENT_VARIABLE_MISSING }
} = require('../../../error/gantree-error')
const { hasOwnProp } = require('../../../utils/has-own-prop')

const envRegex = /(?<=^\$(env|ENV):)[A-Za-z_]+(?=$)/

const createEnvVarCustomizer = (env = {}) => value => {
  if (typeof value !== 'string') {
    return
  }

  const match = value.match(envRegex)
  if (!match) {
    return
  }

  const exists = hasOwnProp(env, match[0])
  if (exists) {
    return env[match[0]]
  }

  throw new GantreeError(
    ENVIRONMENT_VARIABLE_MISSING,
    `Failed to resolve reference in Gantree config: '${value}'`
  )
}

function processor(procProps) {
  const { frame } = procProps
  const logger = frame.logAt('processor/inject-env-vars')
  logger.info('injecting environment variables into config')

  return cloneDeepWith(procProps.gco, createEnvVarCustomizer(frame.env))
}

module.exports = {
  processor
}
