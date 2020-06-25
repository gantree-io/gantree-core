const { createExtractor } = require('../creators/create-extractor')

const extract = createExtractor('telemetry', ({ gco }) => {
  return {
    telemetry: {
      fetch: {
        url: 'https://nyc3.digitaloceanspaces.com/gantree-rozifus-00/flexdapps-telemetry-0.1.0'
      },
      binary_name: 'telemetry',
      service_name: 'telemetry'
    },
    substrate_telemetry_argument: gco.telemetry || 'ws://127.0.0.1:8000/submit',
    telemetry_urls: [gco.telemetry || 'ws://127.0.0.1:8000/submit']
  }
})

module.exports = {
  extract
}
