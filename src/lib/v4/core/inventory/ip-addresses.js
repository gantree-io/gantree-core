
async function extract(frame, combined_inventory) {
  const logger = frame.logAt('ansible/extract/IPs')

  logger.info('...extracting IPs')

  // TODO: ansible code must be changed from "validator" to "node" group
  const nodeHostNames = combined_inventory.validator.children

  logger.debug(`hostnames: '${nodeHostNames}'`)

  let allNodeIps = []

  for (const hostName of nodeHostNames) {
    logger.debug(`----properties of hostname '${hostName}':----`)

    const hostNamesProperties = combined_inventory[hostName]
    logger.debug(hostNamesProperties)

    const hostNameIps = hostNamesProperties.hosts
    logger.debug('--IPs--')
    logger.debug(hostNameIps)

    hostNameIps.forEach(ip_n => {
      allNodeIps.push({
        IP: ip_n,
        hostName: hostName
      })
    })
  }

  logger.debug('ALL IPs:')
  logger.debug(allNodeIps)

  //convert inventoryOutput into NodeIpAddresses

  logger.info('...extracted IPs!')

  return allNodeIps
}

module.exports = {
  extract
}
