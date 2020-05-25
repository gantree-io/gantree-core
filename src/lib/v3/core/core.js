const {
  GantreeError,
  ErrorTypes: { COMMAND_ERROR }
} = require('../../error/gantree-error')
const Frame = require('./frame')
const { sync } = require('./commands/sync')
const { clean } = require('./commands/clean')
const Config = require('../reconfig')

const commandMap = {
  sync: sync,
  clean: clean
}

const run = async args => {
  const frame = Frame.createFrame(args)
  const command = commandMap[args.command]

  if (!command) {
    throw GantreeError(
      COMMAND_ERROR,
      `ConfigV2 - Unsupported command '${args.command}'`
    )
  }

  let gco = args.gco
  gco = Config.validate(frame, gco)
  gco = Config.preprocess(frame, gco)

  await command(frame, gco)
}

module.exports = {
  run
}
