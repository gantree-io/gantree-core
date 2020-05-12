const {
  GantreeError,
  ErrorTypes: { COMMAND_ERROR, MISSING_ARGUMENTS }
} = require('../../gantree-error')
const Frame = require('./frame')
const { sync } = require('./sync')
const { clean } = require('./clean')
const Config = require('../reconfig')

const commandMap = {
  sync: sync,
  clean: clean
}

const assert_arg_defined = (args, argument_name) => {
  if (args[argument_name] === undefined) {
    throw new GantreeError(
      MISSING_ARGUMENTS,
      `Argument not defined '${argument_name}'`
    )
  }
}

const assert_arg_has_value = (args, argument_name) => {
  assert_arg_defined(args, argument_name)
  if (args[argument_name] === null) {
    throw new GantreeError(
      MISSING_ARGUMENTS,
      `Argument is null '${argument_name}'`
    )
  }
}

const check_args = args => {
  assert_arg_has_value(args, 'strict')
  assert_arg_has_value(args, 'verbose')
  assert_arg_has_value(args, 'project_path')
  assert_arg_has_value(args, 'inventory_path')
  assert_arg_has_value(args, 'control_path')
  assert_arg_has_value(args, 'logger')
  assert_arg_has_value(args, 'project_name')
}

const run = async args => {
  check_args(args)

  const frame = Frame.createFrame(args)
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
