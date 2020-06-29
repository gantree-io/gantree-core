const {
  GantreeError,
  ErrorTypes: { UNSUPPORTED_OPERATION, MISSING_ARGUMENTS },
  handleErr
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
  if (!args.command) {
    throw new GantreeError(
      MISSING_ARGUMENTS, // TODO(Denver): Should be able to replace this and other similar instances with a generic func to check for required, then throw if not
      "Must supply 'command'"
    )
  }
  const command = commandMap[args.command]

  if (!command) {
    throw new GantreeError(
      UNSUPPORTED_OPERATION,
      `Lib v${frame.config_version} - '${args.command}' is not a valid option for 'command'`
    )
  }

  let gco = args.gco
  gco = Config.validate(frame, gco)
  gco = Config.preprocess(frame, gco)

  // command(frame, gco)
  command(frame, gco).catch(e => {
    handleErr(frame, e)
  })
}

module.exports = {
  run
}
