const logger = require('./logger')

function create_frame(args) {
  const paths = args.paths || {}
  const options = args.options || {}

  options.strict = Boolean(args.strict || process.env.GANTREE_STRICT_OPERATIONS)

  options.verbose = Boolean(args.verbose || process.env.GANTREE_VERBOSE)

  paths.project = args.project ||
    process.env.GANTREE_OVERRIDE_PROJECT_PATH ||
    process.env.GANTREE_PROJECT_PATH ||
    '/tmp/gantree-project'

  paths.inventory = args.inventory ||
    process.env.GANTREE_OVERRIDE_INVENTORY_PATH ||
    process.env.GANTREE_INVENTORY_PATH ||
    '/tmp/gantre-inventory'

  paths.control = args.control ||
    process.env.GANTREE_CONTROL_PATH ||
    '/tmp/gantree-control'

  return {
    paths,
    options,
    logger
  }
}

module.exports = {
  create_frame
}
