const path = require('path')
const StdJson = require('./utils/std-json')

function getVersion() {
  const targetPath = path.join(
    path.dirname(module.filename),
    '..',
    '..',
    'package.json'
  )
  const pkg = StdJson.read(targetPath)

  return pkg.version
}

function getName() {
  const targetPath = path.join(
    path.dirname(module.filename),
    '..',
    '..',
    'package.json'
  )
  const pkg = StdJson.read(targetPath)

  return pkg.name
}

module.exports = {
  getVersion,
  getName
}
