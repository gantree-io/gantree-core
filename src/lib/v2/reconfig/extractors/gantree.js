const { ensurePath, getToolsPath } = require('../../../utils/path-helpers')

const { extract: system } = require('./system-account')

const extract = extProps => {
  const { control_path } = extProps.frame
  const { substrate_user } = system(extProps)

  return {
    gantree_root: '../',
    gantree_working: `/home/${substrate_user}/tmp/gantree-validator`,
    gantree_control_working: ensurePath(control_path, 'operation'),
    gantree_tools_root: getToolsPath()
  }
}

module.exports = {
  extract
}
