const cloneDeepWith = require('lodash.clonedeepwith')
const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)

const binPresets = require('../../../static_data/binary_presets')
const { throwGantreeError } = require('../../error')
const { returnLogger } = require('../../logging')

const logger = returnLogger('/lib/config/inject')

function processor(procProps) {
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
    throwGantreeError(
      'BAD_CONFIG',
      Error(`Binary preset '${preset}' specified in config not found`)
    )
  }

  gco.binary = binPresets[preset]

  return gco
}

module.exports = {
  processor
}
