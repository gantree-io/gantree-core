const path = require('path')
const fs = require('fs')
const os = require('os')

// NOTE: If you move this file, ensure this path in gantreeLibRoot remains correct
const gantreeLibRoot = () => path.join(__dirname, '../', '../', '../')

const getGantreePath = (...extra) => path.join(gantreeLibRoot(), ...extra)

const getPlaybookFilePath = () => {
  throw new Error('moved to /lib/v*/ansible')
}

const getToolsPath = (...extra) =>
  getGantreePath('src', 'cli', 'tools-cli', ...extra)

const ensurePath = (basePath, ...extra) => {
  const result = path.join(basePath, ...extra)
  fs.mkdirSync(result, { recursive: true })
  return result
}

const getHomePath = (...extra) => {
  return path.join(os.homedir(), ...extra)
}

const getOperationsPath = (...extra) => {
  return path.join(getHomePath(), '.gantree', ...extra)
}

module.exports = {
  getGantreePath,
  getPlaybookFilePath,
  getToolsPath,
  ensurePath,
  getHomePath,
  getOperationsPath
}
