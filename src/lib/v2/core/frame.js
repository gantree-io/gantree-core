const logging = require('../services/logging')
const pick = require('lodash.pick')

const defaultFrame = project_name => {
  return createFrame({
    project_path: '/tmp/gantree-project',
    inventory_path: '/tmp/gantree-inventory',
    control_path: '/tmp/gantree-control',
    strict: false,
    verbose: true,
    logger: logging.returnLogger(),
    project_name
  })
}

const createFrame = args => {
  const frame = pick(args, [
    'project_path',
    'inventory_path',
    'control_path',
    'strict',
    'verbose',
    'logger',
    'project_name'
  ])

  frame.logAt = loc =>
    frame.logger.child({ defaultMeta: { service_name: loc } })

  return frame
}

module.exports = {
  defaultFrame,
  createFrame
}
