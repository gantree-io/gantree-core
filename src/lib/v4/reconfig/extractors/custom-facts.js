const { createExtractor } = require('../creators/create-extractor')

const { extract: IpAddress } = require('./ip-address')

const extract = createExtractor('custom-facts', props => {
  const { sode_facts } = props
  const { ip_address } = IpAddress.node(props)

  const custom_facts = sode_facts[ip_address]

  return {
    custom_facts
  }
})

module.exports = {
  extract
}
