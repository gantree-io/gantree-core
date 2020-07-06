const { createExtractor } = require('../creators/create-extractor')

const { extract: InstanceName } = require('./instance-name')

const extract = createExtractor('base', (props) => {
  const { base, frame, logger } = props

  const { snake_name } = InstanceName.node(props)
  const hosts = base[snake_name] && base[snake_name].hosts
  const ip_address = hosts && hosts[0]

  return { ip_address }
})

module.exports = {
  extract
}
