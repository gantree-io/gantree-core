const CliLogger = require('../support/cli-logger')

const processCommandArgs = args => {
  const strict =
    Boolean(args.strict || process.env.GANTREE_STRICT_OPERATIONS) || false

  const verbose = Boolean(args.verbose || process.env.GANTREE_VERBOSE) || true

  const verbosity = args.verbosity || process.env.GANTREE_VERBOSITY || 'info'

  const config_path = args.config || null
  if (!config_path) {
    throw new Error('Must provide config')
  }

  const project_path =
    args.project ||
    process.env.GANTREE_OVERRIDE_PROJECT_PATH ||
    process.env.GANTREE_PROJECT_PATH ||
    '/tmp/gantree-project'

  const inventory_path =
    args.inventory ||
    process.env.GANTREE_OVERRIDE_INVENTORY_PATH ||
    process.env.GANTREE_INVENTORY_PATH ||
    process.env.GANTREE_INVENTORY_ROOT ||
    '/tmp/gantree-inventory'

  const control_path =
    args.control ||
    process.env.GANTREE_CONTROL_PATH ||
    process.env.GANTREE_CONTROL_ROOT ||
    '/tmp/gantree-control'

  const logger = CliLogger.create({
    level: verbosity,
    log_to_console: true
    // combined_log_path: paths.join(project_path, 'logs')
  })

  return {
    config_path,
    strict,
    verbose,
    verbosity,
    project_path,
    inventory_path,
    control_path,
    logger
  }
}

module.exports = {
  processCommandArgs
}
