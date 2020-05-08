const { Gantree: gantree } = require('../../lib')
const { gantreeTitle } = require('./art')
const StdJson = require('../../lib/utils/std-json')

const { create_frame } = require('./frame')
const { resolve_config_path, extract_project_name, extract_config_version } = require('./resolve_config_path')

async function syncWrapper(args) {
  console.log(gantreeTitle)

  const frame = create_frame(args)
  const config_path = await resolve_config_path(args)
  const gco = StdJson.read(config_path)
  //const project_name = extract_project_name(gco)
  const config_version = extract_config_version(gco)


  switch (config_version) {
    case '2':
      await gantree.sync_v2(frame, gco)
      break
    default:
      throw new Error(`Unsupported config version (${typoeof(config_version)})${config_version})`)
  }
}

module.exports = {
  syncWrapper
}
