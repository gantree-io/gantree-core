const { createExtractor } = require('../creators/create-extractor')

const { extract: CustomFacts } = require('./custom-facts')

const extract = createExtractor('pallet', props => {
  const { gco } = props
  const { chain: { pallets = {} } = {} } = gco

  const pallet_runtime = pallets
  logger.info(pallet_runtime)

  return {
    pallet_runtime
  }
})

module.exports = {
  extract
}
