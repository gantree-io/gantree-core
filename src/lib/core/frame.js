
const {
  GantreeError,
  ErrorTypes: { MISSING_NAMESPACE_ITEM }
} = require('./gantree-error')

const logging = require('../services/logging')
const pathHelpers = require('../utils/path-helpers')

const defaultFrame = project_name => {
  return {
    paths: {
      project: pathHelpers.getProjectPath(project_name),
      inventory: pathHelpers.getInventoryPath(project_name),
      control: pathHelpers.getControlPath()
    },
    options: {
      strict: false,
      verbose: true,
    },
    logger: logging.createLogger(),
    project_name,
  }
}

module.exports = {
  defaultFrame
}
