const path = require('path')
const fs = require('fs')

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

module.exports = {
  getGantreePath,
  getPlaybookFilePath,
  getToolsPath,
  ensurePath
}
