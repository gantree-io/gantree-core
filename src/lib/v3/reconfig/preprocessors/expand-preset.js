const cloneDeepWith = require('lodash.clonedeepwith')
const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)

const binPresets = require('../../static_data/binary_presets')
const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../error/gantree-error')

function processor(procProps) {
  const logger = procProps.frame.logAt('/lib/config/inject')
  logger.info('checking for preset')

  const gco = cloneDeepWith(procProps.gco)

  const hasPreset = hasProp(gco.binary, 'preset')
  if (!hasPreset) {
    return gco
  }

  const preset = gco.binary.preset

  logger.info(`expanding preset '${preset}`)

  const presetExists = hasProp(binPresets, preset)
  if (!presetExists) {
    throw GantreeError(
      BAD_CONFIG,
      `Binary preset '${preset}' specified in config not found`
    )
  }

  gco.binary = binPresets[preset]

  return gco
}

module.exports = {
  processor
}
