const { createExtractor } = require('../creators/create-extractor')

const { extract: Infra } = require('./infra')
const { extract: IpAddress } = require('./ip-address')

const extract = createExtractor('hostname-ip-pair', (props) => {

  const { group_name } = Infra.node(props).infra
  const { ip_address } = IpAddress.node(props)

  return {
    hostname_ip_pair: {
      hostname: group_name,
      ip: ip_address,
    }
  }
})

module.exports = {
  extract
}
