const path = require('path') // for resolving packageDir
const Gantree = require('./gantree')
const Errors = require('./error/gantree-error')
const Logger = require('./logging/logger')
const packageMeta = require('../package/package-meta')
const envPython = require('./utils/env-python')
const pathHelpers = require('./utils/path-helpers')

const packageDir = path.join(__dirname, '../')
const name = packageMeta.getName()
const version = packageMeta.getVersion()

const Utils = {
  getPythonInterpreterPath: envPython.getInterpreterPath,
  getOperationsPath: pathHelpers.getOperationsPath
}

module.exports = {
  Gantree,
  Errors,
  Utils,
  Logger,
  packageDir,
  name,
  version
}
