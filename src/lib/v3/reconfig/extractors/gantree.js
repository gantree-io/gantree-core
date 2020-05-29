const { ensurePath, getToolsPath } = require('../../../utils/path-helpers')
const { createExtractor } = require('../creators/create-extractor')

const { extract: System } = require('./system-account')

const extract = createExtractor('system', props => {
  const { control_path } = props.frame
  const { substrate_user } = System.node(props)

  return {
    gantree_root: '../',
    gantree_working: `/home/${substrate_user}/tmp/gantree-validator`,
    // TODO(ryan): no mutations
    gantree_control_working: ensurePath(control_path, 'operation'),
    gantree_tools_root: getToolsPath()
  }
})

module.exports = {
  extract
}
