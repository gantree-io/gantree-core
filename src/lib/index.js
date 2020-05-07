const path = require('path') // for resolving packageDir
const Gantree = require('./gantree')
const Config = require('./reconfig')
const Errors = require('./gantree-error')
const packageMeta = require('./packageMeta')

const packageDir = path.join(__dirname, '../')
const name = packageMeta.getName()
const version = packageMeta.getVersion()

module.exports = {
  Config,
  Gantree,
  Errors,
  packageDir,
  name,
  version
}
