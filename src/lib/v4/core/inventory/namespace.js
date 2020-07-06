const fs = require('fs')

async function create(frame) {
  const logger = frame.logAt('ansible/inventory/namespace')

  logger.info(`creating namespace at ${frame.active_path}`)

  fs.mkdirSync(frame.active_path, { recursive: true })

  logger.info('namespace created')
}

module.exports = {
  create
}
