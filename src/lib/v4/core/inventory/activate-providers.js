//todo: cleanup for lib-centric approach
const path = require('path')

const dynamicGcp = require('../../providers/gcp/dynamic')
const dynamicAws = require('../../providers/aws/dynamic')
const dynamicDo = require('../../providers/do/dynamic')

const activateProviders = (frame, gco) => {
  const activePath = path.join(frame.project_path, 'active')

  dynamicGcp.managePlugin(gco, activePath)
  dynamicAws.managePlugin(gco, activePath)
  dynamicDo.managePlugin(gco, activePath)
}

module.exports = {
  activateProviders
}
