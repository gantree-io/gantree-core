/** @typedef {Object.<string,*>} lib_args Arguments for Gantree library*/
/** @typedef {(lib_args: lib_args, arg_name: String) => lib_args} Mod Argument modification function */

const {
  GantreeError,
  ErrorTypes: { MISSING_ARGUMENTS }
} = require('../../error/gantree-error')

const notUndef = (args, argument_name) => {
  if (args[argument_name] === undefined) {
    throw new GantreeError(
      MISSING_ARGUMENTS,
      `Argument not defined '${argument_name}'`
    )
  }
  return args
}

const notNull = (args, argument_name) => {
  notUndef(args, argument_name)
  if (args[argument_name] === null) {
    throw new GantreeError(
      MISSING_ARGUMENTS,
      `Argument is null '${argument_name}'`
    )
  }
  return args
}

const fallback = fallback_value => {
  return (args, arg_name) => {
    if (args[arg_name] === undefined) {
      return { ...args, [arg_name]: fallback_value }
    }
    return args
  }
}

const funcback = (fallback_func, ...params) => {
  return (args, arg_name) => {
    if (args[arg_name] === undefined) {
      return { ...args, [arg_name]: fallback_func(...params) }
    }
    return args
  }
}

const assertType = type_name => {
  return (args, arg_name) => {
    if (typeof args[arg_name] !== type_name) {
      throw new GantreeError(
        MISSING_ARGUMENTS,
        `Argument '${arg_name}' must be of type '${type_name}'`
      )
    }
    return args
  }
}

/**
 * Return single arg from args after processing with mods. Returns null if arg name missing.
 * @param {Object} args - All args. Obj shape is {arg: value, arg: value}
 * @param {String} arg_name - Arg to return
 * @param {...Mod} mods - Functions to modify target arg
 */
const oPick = (args, arg_name, ...mods) => {
  const modArgs = mods.reduce((p, mod) => ({ ...mod(p, arg_name) }), args)
  const result =
    (modArgs[arg_name] && { [arg_name]: modArgs[arg_name] }) || null
  return result
}

module.exports = {
  oPick,
  fallback,
  funcback,
  notUndef,
  notNull,
  assertType
}
