const fs = require('fs')

async function create(frame) {
  const logger = frame.logAt('lib/ansible/inventory/namespace')

  logger.info('creating namespace')

  // create paths recursively
  fs.mkdirSync(frame.active_path, { recursive: true })

  // do stuff
  // create gantree folder
  // create active folder
  logger.info('namespace created')
}

module.exports = {
  create
}
