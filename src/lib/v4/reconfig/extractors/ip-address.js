const { createExtractor } = require('../creators/create-extractor')

const { extract: Infra } = require('./infra')

const extract = createExtractor('ip-address', (props) => {
  const { base, frame, logger } = props

  const { group_name } = Infra.node(props).infra
  const hosts = base[group_name] && base[group_name].hosts
  const ip_address = hosts && hosts[0]

  return { ip_address }
})

module.exports = {
  extract
}
