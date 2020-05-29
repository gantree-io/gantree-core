const { createExtractor } = require('../creators/create-extractor')

const extractorGcp = require('../../providers/gcp/extractor')
const extractorAws = require('../../providers/aws/extractor')
const extractorDo = require('../../providers/do/extractor')

const { extract: Name } = require('./name')
const { extract: Metadata } = require('./metadata')

const providerExtractors = {
  gcp: extractorGcp,
  aws: extractorAws,
  do: extractorDo
}

const getProviderExtractor = ({ nco, index }) => {
  const providerId = nco.instance && nco.instance.provider

  if (!providerId) {
    throw Error(`no provider for node ${index}`)
  }

  const extractor = providerId && providerExtractors[providerId]

  if (!extractor) {
    throw Error(`Unknown provider: ${providerId}`)
  }

  return extractor
}

const extract = createExtractor('infra', props => {
  const ProviderExtractor = getProviderExtractor(props)

  const { name } = Name.node(props)
  const { project_name } = Metadata.node(props)

  const infraProps = { name, project_name }

  return ProviderExtractor.extractInfra(props, infraProps)
})

module.exports = {
  extract
}
