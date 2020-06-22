const { Utils, Logger } = require('../../../lib')

const processCommandArgs = async args => {
  const strict =
    Boolean(args.strict || process.env.GANTREE_STRICT_OPERATIONS) || false

  // const verbose = Boolean(args.verbose || process.env.GANTREE_VERBOSE) || true

  const verbosity = args.verbosity || process.env.GANTREE_VERBOSITY || 'info'

  const enable_process_stdout = true

  const config_path = args.config || process.env.GANTREE_CONFIG_PATH
  if (!config_path) {
    throw new Error(
      'Must provide config argument or set env:GANTEREE_CONFIG_PATH'
    )
  }

  const project_root =
    args.project_root ||
    process.env.GANTREE_PROJECT_ROOT ||
    process.env.GANTREE_OVERRIDE_INVENTORY_PATH ||
    process.env.GANTREE_INVENTORY_PATH ||
    process.env.GANTREE_INVENTORY_ROOT ||
    `${Utils.getOperationsPath()}/gantree-inventory`

  const project_path =
    args.project ||
    process.env.GANTREE_OVERRIDE_PROJECT_PATH ||
    process.env.GANTREE_PROJECT_PATH ||
    null

  const control_root =
    args.control ||
    process.env.GANTREE_CONTROL_ROOT ||
    process.env.GANTREE_CONTROL_PATH ||
    `${Utils.getOperationsPath()}/gantree-control`

  const logger = Logger.create({
    level: verbosity,
    console_log: true,
    // TODO(ryan): make log files argument driven
    log_file: 'gantree.log',
    error_log_file: 'gantree-error.log'
  })

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
    // verbosity,
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
