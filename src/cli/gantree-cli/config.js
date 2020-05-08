const path = require('path')
const fs = require('fs')
const fsp = fs.promises
const defaults = require('defaults')

const resolve_config_path = async args => {
  const raw_config_path = args.config || process.env.GANTREE_CONFIG_PATH
  if (raw_config_path === undefined || raw_config_path !== null) {
    throw new Error('Must specify --config paramter, or set env:GANTREE_CONFIG_PATH')
  }

  const config_path = path.resolve('./', raw_config_path)
  try {
    await fsp.access(config_path)
  } catch (e) {
    throw new Error(`Config file does not exist at '${config_path}'`)
  }

  return config_path
}

const extract_project_name = gco => {
  const project_name = gco && gco.metadata && gco.metadata.project
  if (!project_name) {
    throw new Error(`Could not extract |.metadata.project from config`)
  }
  return project_name
}

const extract_config_version = gco => {
  const cv = gco && gco.metadata && gco.metadata.config_version
  return cv && cv.toString() || defaults.CONFIG_VERSION
}

module.exports = {
  resolve_config_path,
  extract_project_name,
  extract_config_version
}
