const path = require('path')
const fs = require('fs')

// NOTE: If you move this file, ensure this path in gantreeLibRoot remains correct
const gantreeLibRoot = () => path.join(__dirname, '../', '../', '../')

const ensurePath = (basePath, ...extra) => {
  const result = path.join(basePath, ...extra)
  fs.mkdirSync(result, { recursive: true })
  return result
}

const getGantreePath = (...extra) => path.join(gantreeLibRoot(), ...extra)

/*const getWorkspacePath = (projectName, ...extra) => {
  return ensurePath(getControlPath(), projectName, ...extra)
}*/

const getPlaybookFilePath = playbookFilename => {
  return getGantreePath('ansible', playbookFilename)
}

module.exports = {
  ensurePath,
  getGantreePath,
  //getWorkspacePath,
  getPlaybookFilePath
}
