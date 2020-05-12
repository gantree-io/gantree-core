const path = require('path') // for resolving packageDir
const Gantree = require('./gantree')
const Frame = require('./v2/core/frame')
const Errors = require('./gantree-error')
const Logging = require('./v2/services/logging')
const Config = require('./v2/reconfig')
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
