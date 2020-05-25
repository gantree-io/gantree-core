const Ajv = require('ajv')
const checks = require('../checks')
const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../error/gantree-error')
const gantree_config_schema = require('../../schemas/gantree_config_schema')
const provider_specific_keys = require('../../static_data/provider_specific_keys')
const { hasOwnProp } = require('../../../utils/has-own-prop')

// TODO: change language to 'nodes' instead of 'validators'
function validateProviderSpecificKeys(frame, gco) {
  const logger = frame.logAt('validate/validateProviderSpecificKeys')

  let missing_provider_keys = {}

  for (const node of gco.nodes) {
    const provider = node.instance.provider

    if (!(provider in provider_specific_keys)) {
      logger.info(`No ${provider} specific keys required`)
      continue
    }

    missing_provider_keys[provider] = [] // create empty array under provider name
    const required_keys = provider_specific_keys[provider]

    for (const key of required_keys) {
      if (!hasOwnProp(node.instance, key)) {
        missing_provider_keys[provider].push(key)
      }
    }
  }

  let missing_messages = []

  for (const [provider, keys_missing] of Object.entries(
    missing_provider_keys
  )) {
    if (keys_missing.length > 0) {
      const message = `Required ${provider} keys missing: ${keys_missing}`
      logger.error(message)
      missing_messages.push(message)
    } else {
      logger.info(`All required ${provider} specific keys satisfied`)
    }
  }

  if (missing_messages.length > 0) {
    throw new GantreeError(
      BAD_CONFIG,
      `provider-specific key/s missing: ${missing_messages}`
    )
  }
}

function validateConfig(frame, gco) {
  const logger = frame.logAt('validate/validateConfig')

  if (gco === undefined) {
    logger.error('Validate must receive a config object as input')
    throw new GantreeError(
      BAD_CONFIG,
      'Validate must receive a config object as input'
    )
  }

  const ajv = new Ajv({ allErrors: true })
  const validate = ajv.compile(gantree_config_schema)
  const is_valid = validate(gco)

  if (!is_valid) {
    console.error('Invalid Gantree config detected')
    validate.errors.forEach(e => {
      logger.error(
        `--ISSUE: ${e.dataPath} ${e.message} (SCHEMA:${e.schemaPath})`
      )
    })
    throw new GantreeError(BAD_CONFIG, 'invalid gantree config')
  }

  logger.info('Gantree configuration validated successfully')

  validateProviderSpecificKeys(frame, gco)
  checks.config.nodeNameCharLimit(frame, gco)

  return gco
}

module.exports = {
  config: validateConfig
}
