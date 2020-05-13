const path = require('path') // for resolving packageDir
const Gantree = require('./gantree')
const Errors = require('./gantree-error')
const packageMeta = require('../package/package-meta')
const envPython = require('./utils/env-python')

const packageDir = path.join(__dirname, '../')
const name = packageMeta.getName()
const version = packageMeta.getVersion()

const Utils = {
  getPythonInterpreterPath: envPython.getInterpreterPath
}

module.exports = {
  Gantree,
  Errors,
  Utils,
  packageDir,
  name,
  version
}
