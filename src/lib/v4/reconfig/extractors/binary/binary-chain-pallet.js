
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

const createTokenCustomizer = (frame, tokens) => {
  const logger = frame.logAt('binary-chain-pallet|tokenCustomizer')

  return value => {
    logger.debug(value)
    if (typeof value !== 'string') {
      return
    }

    logger.debug(value)

    const match = value.match(nodeRegex)
    if (!match) {
      return
    }

    logger.debug(match)

    const [_, raw_node_index, raw_algo] = match
    const node_index = raw_node_index
    const algo = ALGO_MAP[raw_algo]

    logger.debug({
      node_index, algo
    })

    const address = tokens[node_index][algo].address

    return address
  }
}

function processor({ frame, pallets, tokens }) {
  return cloneDeepWith(pallets, createTokenCustomizer(frame, tokens))
}

const extract = createExtractor('binary-chain-pallet', props => {
  const { gco, logger, frame } = props
  const { chain: { pallets = {} } = {} } = gco
  const all_facts = CustomFacts.all(props)
  const all_session = all_facts.map(f => f && f.custom_facts && f.custom_facts.session)

  const pallet_runtime = processor({
    frame,
    pallets,
    tokens: all_session
  })

  return {
    pallet_runtime
  }
})

module.exports = {
  extract
}
