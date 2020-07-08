

const getHosts = (frame, active) => {
  const logger = frame.logAt('gantree-node-inventory/getHosts')

  //logger.info(active)

  return active && active.status_active && active.status_active.hosts || []
}

module.exports = {
  getHosts
}
