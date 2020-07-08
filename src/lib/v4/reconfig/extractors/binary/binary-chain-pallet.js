
const path = require('path')
const cloneDeepWith = require('lodash.clonedeepwith')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: CustomFacts } = require('../custom-facts')

const nodeRegex = /\$node\((\d+)\)\:((sr|sr25519|ed|ed25519))$/

const ALGO_MAP = {
  sr: "sr25519",
  sr25519: "sr25519",
  ed: "ed25519",
  ed25519: "ed25519"
}

const createTokenCustomizer = tokens => value => {
  if (typeof value !== 'string') {
    return
  }

  const match = value.match(nodeRegex)
  if (!match) {
    return
  }

  const [_, raw_node_index, raw_algo] = match
  const node_index = raw_node_index
  const algo = ALGO_MAP[raw_algo]

  const address = tokens[node_index][algo].address

  return address
}

function processor({ rawPallet = {}, tokens = {} }) {
  return cloneDeepWith(rawPallet, createTokenCustomizer(tokens))
}

const extract = createExtractor('binary-chain-pallet', props => {
  const { gco, logger } = props
  const { chain: { pallets = {} } = {} } = gco
  const all_facts = CustomFacts.all(props)
  const all_session = all_facts.map(f => f && f.custom_facts && f.custom_facts.session)

  const pallet_runtime = processor({
    rawPallets: pallets,
    tokens: all_session
  })

  logger.info(pallets)
  logger.info(all_session)
  logger.info(pallet_runtime)

  return {
    pallet_runtime
  }
})

module.exports = {
  extract
}
