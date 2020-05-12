const {
  GantreeError,
  ErrorTypes: { COMMAND_ERROR }
} = require('../../gantree-error')
const Frame = require('./frame')
const { sync } = require('./sync')
const { clean } = require('./clean')
const Config = require('../reconfig')

const commandMap = {
  sync: sync,
  clean: clean
}

const run = async args => {
  const frame = Frame.defaultFrame()
  const command = commandMap[args.command]

  if (!command) {
    throw GantreeError(
      COMMAND_ERROR,
      `ConfigV2 - Unsupported command '${args.command}'`
    )
  }

  let gco = args.gco
  gco = Config.validate(gco)
  gco = Config.preprocess(gco)

  await command(frame, gco)
}

module.exports = {
  run
}
