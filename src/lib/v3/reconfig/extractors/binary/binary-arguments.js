const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: InstanceName } = require('../instance-name')
const { extract: Telemetry } = require('../telemetry')
const { extract: BinaryChain } = require('./binary-chain')
const { extract: BinaryNodeKeyFile } = require('./binary-node-key-file')


const addLine = (s, text) => s + " \\\n" + text
const addLineEach = (s, li, fn) => li.reduce((p, c) => addLine(p, fn(c)), s)

//TODO(ryan): logging filter support?
//TODO(ryan): validator optional?

const extract = createExtractor('binary-arguments', props => {
  const { gco, nco } = props

  const bo = nco.binary_options || nco.binaryOptions || {}
  const binary = gco.binary || {}

  let barg = ""

  // name
  const bo_node_name = bo.name || InstanceName.node(props).name
  barg = addLine(barg, `--name ${bo_node_name}`)

  // validator
  barg = addLine(barg, `--validator`)

  // rpc-port
  const bo_rpc_port = bo.rpc_port || bo.rpcPort || 9933
  barg = addLine(barg, `--rpc-port=${bo_rpc_port}`)

  // chain
  const { chain } = BinaryChain.node(props)
  if (chain) {
    barg = addLine(barg, `--chain=${chain}`)
  }

  // (user defined options)
  const bo_options = bo.substrate_options || bo.substrateOptions || []
  barg = addLineEach(barg, bo_options, opt => opt)

  // bootnodes
  const bo_bootnodes = binary.bootnodes || []
  barg = addLineEach(barg, bo_bootnodes, bn => `--bootnodes=${bn}`)

  // telemetry
  const { telemetry_urls } = Telemetry.node(props)
  barg = addLineEach(barg, telemetry_urls, turl => `--telemetry-url="${turl} 0"`)
  if (telemetry_urls.length === 0) {
    barg = addLine('--no-telemetry')
  }

  // node-key-file
  const { node_key_file } = BinaryNodeKeyFile.node(props)
  barg = addLine(barg, `--node-key-file="${node_key_file}"`)

  return {
    sb_binary_arguments: barg
  }
})


module.exports = {
  extract
}
