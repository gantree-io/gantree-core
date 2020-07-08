const { createExtractor } = require('../creators/create-extractor')

const { extract: Infra } = require('./infra')

const extract = createExtractor('ip-address', (props) => {
  const { active, logger } = props

  const { group_name, snake_name } = Infra.node(props).infra

  logger.info(`group_name: ${group_name}`)

  let hosts
  hosts = active[group_name] && active[group_name].hosts

  // TODO: fix this in providers
  if (hosts == null) {
    hosts = active[snake_name] && active[snake_name].hosts
  }

  const ip_address = hosts && hosts[0]

  logger.info(ip_address)

  return { ip_address }
})

module.exports = {
  extract
}
