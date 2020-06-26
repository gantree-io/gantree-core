const path = require('path')
const StdJson = require('../lib/utils/std-json')

function _getPackageDotJson() {
  const targetPath = path.join(
    path.dirname(module.filename),
    '..',
    '..',
    'package.json'
  )
  return StdJson.read(targetPath)
}

module.exports = {
  getVersion: () => {
    return _getPackageDotJson().version
  },
  getName: () => {
    return _getPackageDotJson().name
  },
  getRepository: () => {
    return _getPackageDotJson().repository
  }
}
