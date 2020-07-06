const cloneDeepWith = require('lodash.clonedeepwith')

const hasOwnProp = (c, p) => Object.prototype.hasOwnProperty.call(c, p)


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

module.exports = {
  processor
}
