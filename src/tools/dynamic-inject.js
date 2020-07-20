
const fs = require('fs')
//const BigNumber = require('bignumber.js')
//const merge = require('lodash.merge')
const opt = require('../lib/utils/options')
const StdJson = require('../lib/utils/std-json')
//const { processor: tokenReplacer } = require('./replace-tokens')

const RUNTIME_PROTECTED = ['system'];

function dynamicInject(chainSpecPath, validatorSpecPath, palletRuntimePath, _allowRaw) {
  const allowRaw = opt.default(_allowRaw, false)

  if (!fs.existsSync(chainSpecPath)) {
    console.error(`No chainSpec file found at path: ${chainSpecPath}`)
    throw new Error("couldn't find chainSpec file for inject")
  }
  if (!fs.existsSync(validatorSpecPath)) {
    console.error(`No validatorSpec file found at path: ${validatorSpecPath}`)
    throw new Error("couldn't find validatorSpec file for inject")
  }
  if (!fs.existsSync(palletRuntimePath)) {
    console.error(`No palletRuntimeSpec file found at path: ${palletRuntimePath}`)
    throw new Error("couldn't find validatorSpec file for inject")
  }

  const chainSpec = StdJson.read(chainSpecPath, 'utf-8')
  const validatorSpec = StdJson.read(validatorSpecPath, 'utf-8')
  const palletRuntime = StdJson.read(palletRuntimePath, 'utf-8')

  const chainspec_injectable = checkChainspecValid(chainSpec, allowRaw)

  if (chainspec_injectable === true) {
    const injectedChainSpec = _realInject(chainSpec, validatorSpec, palletRuntime)
    const injectedChainSpecStr = StdJson.stringify(injectedChainSpec)
    process.stdout.write(injectedChainSpecStr)
  }
}

function _realInject(chainSpec, validatorSpec, palletRuntime) {
  let runtimeObj = _insertRuntime(chainSpec.genesis.runtime, validatorSpec, palletRuntime)
  let bootnodes = _insertBootnodes(chainSpec.bootnodes, validatorSpec)
  chainSpec.genesis.runtime = runtimeObj
  chainSpec.bootNodes = bootnodes
  return chainSpec
}



function _insertRuntime(baseRuntime, validatorSpec, palletRuntime) {
  updatedRuntime = { ...baseRuntime, ...palletRuntime }

  /*
  for (let i = 0; i < validatorSpec.validators.length; i++) {
    let validator_n = validatorSpec.validators[i]
  }
  */

  return updatedRuntime
}

function _insertBootnodes(bootnodes, validatorSpec) {
  bootnodes = []
  for (let validator of validatorSpec.validators) {
    bootnodes.push(
      `/ip4/${validator.libp2p.ip_addr}/tcp/30333/p2p/${validator.libp2p.node_key}`
    )
  }
  return bootnodes
}

// todo: this function needs a face-lift
function checkChainspecValid(chainSpecObj, allowRaw) {
  if (chainSpecObj.genesis == undefined) {
    //logger.error( "Invalid chainspec, no 'genesis' key found. Ensure you're passing the correct json file.")
    throw new Error(
      "Invalid chainspec, no 'genesis' key found. Ensure you're passing the correct json file."
    )
  }

  if (chainSpecObj.genesis.runtime !== undefined) {
    // chainspec is injectable
    return true
  }

  if (chainSpecObj.genesis.raw == undefined) {
    // logger.error("Cannot inject values into chainspec with no '.genesis.raw' key")
    throw new Error(
      "Cannot inject values into chainspec with no '.genesis.raw' key"
    )
  }

  if (allowRaw !== true) {
    // logger.error('Inject function does not accept raw chainspecs unless --allow-raw specified')
    throw new Error(
      'Inject function does not accept raw chainspecs unless --allow-raw specified'
    )
  }

  //logger.warn('----------------')
  //logger.warn('raw chainspec used as input')
  //logger.warn('this is highly discouraged')
  //logger.warn('Function output will be raw instead of non-raw')
  //logger.warn('----------------')
  const chainspec_str = StdJson.stringify(chainSpecObj)
  process.stdout.write(chainspec_str)
  return false
}

module.exports = {
  dynamicInject
}
