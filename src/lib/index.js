const path = require('path') // for resolving packageDir
const Gantree = require('./core/gantree')
const Options = require('./core/options')
const Frame = require('./core/frame')
const Errors = require('./core/gantree-error')
const Logging = require('./services/logging')
const Config = require('./reconfig')
const packageMeta = require('../package/package-meta')

const packageDir = path.join(__dirname, '../')
const name = packageMeta.getName()
const version = packageMeta.getVersion()

module.exports = {
  Config,
  Gantree,
  Frame,
  Errors,
  Logging,
  packageDir,
  name,
  version
}
