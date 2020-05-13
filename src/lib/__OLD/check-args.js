const {
  GantreeError,
  ErrorTypes: { MISSING_ARGUMENTS }
} = require('../gantree-error')

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
  assert_arg_has_value(args, 'control_root')
  assert_arg_has_value(args, 'logger')
  assert_arg_has_value(args, 'project_name')
  assert_arg_has_value(args, 'python_interpreter')
}

module.exports = {
  assert_arg_defined,
  assert_arg_has_value,
  check_args
}
