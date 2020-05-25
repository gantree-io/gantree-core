async function IPs(frame, combined_inventory) {
  const logger = frame.logAt('ansible/extract/IPs')

  logger.info('...extracting IPs')

  // TODO: ansible code must be changed from "validator" to "node" group
  const nodeHostNames = combined_inventory.validator.children

  logger.info(nodeHostNames)

  let allNodeIps = []

  for (const hostName of nodeHostNames) {
    // use names to pull out hostname objects
    const hostNamesProperties = combined_inventory[hostName]
    const hostNameIps = hostNamesProperties.hosts

    logger.info(`----properties of hostname '${hostName}':----`)
    logger.info(hostNamesProperties)
    logger.info('--IPs--')
    logger.info(hostNameIps)

    hostNameIps.forEach(ip_n => {
      allNodeIps.push({
        IP: ip_n,
        hostName: hostName
      })
    })
  }
  logger.info('ALL IPs:')
  logger.info(allNodeIps)

  //convert inventoryOutput into NodeIpAddresses

  logger.info('...extracted IPs!')

  return allNodeIps
}

module.exports = {
  IPs
}
