const fs = require('fs')
const path = require('path')
const { diff: JsonDiff } = require('json-diff')

const StdJson = require('../../../utils/std-json')
const Logger = require('../../../logging/logger')
const { createFrame } = require('../../core/frame')
const operation = require('../inventories/operation')
const { processor: full_preprocess } = require('../preprocessors/full')

const getTestFrame = gco =>
  createFrame({
    logger: Logger.create({ service_name: 'Reconfig Tests' }),
    project_path: '/tmp/gantree-test-project/',
    control_root: '/tmp/gantree-test-control/',
    strict: false,
    gco,
    env: {
      DRIFT_TEST_PRIVATE_KEY_PATH: path.join(
        __dirname,
        'support',
        'drift_test_private_key'
      )
    }
  })

const getPairs = (pairs_path, source_ext, result_ext) => {
  if (typeof source_ext !== 'string') {
    throw Error('source extension must be type string')
  }

  if (typeof result_ext !== 'string') {
    throw Error('result extension must be type string')
  }

  if (source_ext === result_ext) {
    throw Error(
      `source extension cannot be the same as result extension '${source_ext}'`
    )
  }

  const pairs = []

  fs.readdirSync(pairs_path).forEach(conf_filename => {
    const ext = path.extname(conf_filename)
    if (ext !== '.' + source_ext) {
      return
    }
    const conf_filepath = path.join(pairs_path, conf_filename)

    const inventory_filename = [
      ...conf_filename.split('.').slice(0, -1),
      result_ext
    ].join('.')
    const inventory_filepath = path.join(pairs_path, inventory_filename)

    pairs.push([conf_filepath, inventory_filepath])
  })

  return pairs
}

const run = async () => {
  const data_path = path.join(__dirname, 'data')
  const pairs = getPairs(data_path, 'json', 'inventory')

  pairs.forEach(([config_filepath, result_filepath]) => {
    let expected_inventory
    try {
      expected_inventory = StdJson.read(result_filepath)
    } catch (e) {
      console.log(
        `No expected inventory for '${config_filepath}. Invalid inventory json at: '{result_filepath}'`
      )
      expected_inventory = {}
    }

    const raw_gco = StdJson.read(config_filepath)
    const frame = getTestFrame(raw_gco)
    const gco = full_preprocess({ frame, gco: raw_gco })
    const generated_inventory = operation.inventory({ frame, gco })

    const diff = JsonDiff(expected_inventory, generated_inventory)

    console.log(`#### ${config_filepath} ####`)
    if (diff) {
      console.log(StdJson.stringify(diff, null, 2))
    } else {
      console.log('NO CHANGE')
    }
    console.log()
  })
}

run()
