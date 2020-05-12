const logging = require('../services/logging')

const defaultFrame = project_name => {
  const frame = {
    paths: {
      project: '/tmp/gantree-project',
      inventory: '/tmp/gantree-inventory',
      control: '/tmp/gantree-control'
    },
    options: {
      strict: false,
      verbose: true
    },
    log: {
      logger: logging.returnLogger()
    },
    project_name
  }

  frame.log.at = loc =>
    frame.log.logger.child({ defaultMeta: { service_name: loc } })

  return frame
}

module.exports = {
  defaultFrame
}
