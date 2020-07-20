const { createExtractor } = require('../creators/create-extractor')

const { extract: HostnameIpPairs } = require('./hostname-ip-pairs')

const extract = createExtractor('hostname-ip-pairs', (props) => {
  const { active, logger } = props

  return {
    ...HostnameIpPairs.node(props)
  }
})

module.exports = {
  extract
}
