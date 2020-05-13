const CliLogger = require('../support/cli-logger')
const { Utils } = require('../../../lib')

const processCommandArgs = async args => {
  const strict =
    Boolean(args.strict || process.env.GANTREE_STRICT_OPERATIONS) || false

  const verbose = Boolean(args.verbose || process.env.GANTREE_VERBOSE) || true

  const verbosity = args.verbosity || process.env.GANTREE_VERBOSITY || 'info'

  const config_path = args.config || null
  if (!config_path) {
    throw new Error('Must provide config')
  }

  const project_root =
    args.project_root ||
    process.env.GANTREE_PROJECT_ROOT ||
    process.env.GANTREE_OVERRIDE_INVENTORY_PATH ||
    process.env.GANTREE_INVENTORY_PATH ||
    process.env.GANTREE_INVENTORY_ROOT ||
    '/tmp/gantree-inventory'

  const project_path =
    args.project ||
    process.env.GANTREE_OVERRIDE_PROJECT_PATH ||
    process.env.GANTREE_PROJECT_PATH ||
    null

  const control_root =
    args.control ||
    process.env.GANTREE_CONTROL_ROOT ||
    process.env.GANTREE_CONTROL_PATH ||
    '/tmp/gantree-control'

  const logger = CliLogger.create({
    level: verbosity,
    log_to_console: true
    // combined_log_path: paths.join(project_path, 'logs')
  })

  const python_interpreter =
    args.python_interpreter ||
    process.env.GANTREE_PYTHON_INTERPRETER ||
    (await Utils.getPythonInterpreterPath())

  return {
    config_path,
    strict,
    verbose,
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
