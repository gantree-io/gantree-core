const { Utils, Logger } = require('../../../lib')

const processCommandArgs = async args => {
  const strict =
    Boolean(args.strict || process.env.GANTREE_STRICT_OPERATIONS) || false

  // const verbose = Boolean(args.verbose || process.env.GANTREE_VERBOSE) || true

  const verbosity =
    args.verbosity === true
      ? 'debug'
      : args.verbosity ||
        process.env.GANTREE_VERBOSITY ||
        Logger.getDefaultLevel()
  if (!(verbosity in Logger.getValidLevels())) {
    throw new Error(
      `Invalid verbosity level - [options: ${Object.keys(
        Logger.getValidLevels()
      ).join(', ')}]`
    )
  }
  // TODO(Denver): Find a way to do below outside of this data-focused script (also for all other overrides)
  if (args.verbosity) {
    console.log(`[!] Verbosity set manually - '${verbosity}'\n`)
  }

  const enable_process_stdout = true

  /** @type {String} */
  const config_path = args.config || process.env.GANTREE_CONFIG_PATH
  if (!config_path) {
    throw new Error(
      'Must provide config argument or set env:GANTEREE_CONFIG_PATH'
    )
  }

  /** @type {String} */
  const project_root =
    args.project_root ||
    process.env.GANTREE_PROJECT_ROOT ||
    process.env.GANTREE_OVERRIDE_INVENTORY_PATH ||
    process.env.GANTREE_INVENTORY_PATH ||
    process.env.GANTREE_INVENTORY_ROOT ||
    '/tmp/gantree-inventory'

  /** @type {String} */
  const project_path =
    args.project ||
    process.env.GANTREE_OVERRIDE_PROJECT_PATH ||
    process.env.GANTREE_PROJECT_PATH ||
    null

  /** @type {String} */
  const control_root =
    args.control ||
    process.env.GANTREE_CONTROL_ROOT ||
    process.env.GANTREE_CONTROL_PATH ||
    '/tmp/gantree-control'

  const logger = Logger.create({
    level: verbosity,
    console_log: true,
    // TODO(ryan): make log files argument driven
    log_file: 'gantree.log',
    error_log_file: 'gantree-error.log'
  })

  /** @type {String} */
  const python_interpreter =
    args.python_interpreter ||
    process.env.GANTREE_PYTHON_INTERPRETER ||
    (await Utils.getPythonInterpreterPath())

  return {
    enable_process_stdout,
    config_path,
    strict,
    // TODO(ryan): remove if verbosity encapsulated by logger and nothing breaks
    // verbose,
    verbosity,
    project_root,
    project_path,
    control_root,
    logger,
    python_interpreter
  }
}

module.exports = {
  processCommandArgs
}
