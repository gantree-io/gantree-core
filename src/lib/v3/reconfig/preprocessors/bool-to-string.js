const cloneDeepWith = require('lodash.clonedeepwith')

function boolToStringCustomizer(value) {
  if (value === true) {
    return 'true'
  }
  if (value === false) {
    return 'false'
  }
}

function processor(procProps) {
  const logger = procProps.frame.logAt('preprocessors/bool-to-string')
  logger.info('converting booleans in config to strings')

  return cloneDeepWith(procProps.gco, boolToStringCustomizer)
}

module.exports = {
  processor
}
