const fs = require('fs')
const path = require('path')
const { diff: JsonDiff } = require('json-diff')
const cloneDeepWith = require('lodash.clonedeepwith')

const StdJson = require('../../../utils/std-json')
const PathHelpers = require('../../../utils/path-helpers')
const Logger = require('../../../logging/logger')
const { createFrame } = require('../../core/frame')
const operation = require('../inventories/operation')
const { processor: full_preprocess } = require('../preprocessors/full')

const replaceExtension = (filename, new_ext) => [...filename.split('.').slice(0, -1), new_ext].join('.')

const getTestFrame = gco => {
  const DRIFT_TEST_PRIVATE_KEY_PATH = path.join(__dirname, 'test-assets', 'drift_test_private_key')

  return createFrame({
    logger: Logger.create({
      service_name: 'Reconfig Tests',
      null_transport: true
    }),
    project_path: '/tmp/gantree-test-project/',
    control_root: '/tmp/gantree-test-control/',
    strict: false,
    gco,
    env: {
      DRIFT_TEST_PRIVATE_KEY_PATH,
      GANTREE_INSTANCE_PRIVATE_KEY_PATH: DRIFT_TEST_PRIVATE_KEY_PATH,
      GCP_PROJECT_NAME: 'GCP_PROJECT_TEST_VALUE'
    }
  })
}

const getSamples = () => [
  'config/fetch/polkadot_aws.sample.json',
  'config/fetch/polkadot_do.sample.json',
  'config/fetch/polkadot_gcp.sample.json'
]

const getFilesWithExtension = (files_path, ext) => {
  if (typeof ext !== 'string' || ext.trim() === "") {
    throw Error('extension must be type string')
  }

  return fs.readdirSync(files_path)
    .filter(filename => path.extname(filename) === '.' + ext)
    .map(filename => path.join(files_path, filename))
}

const sanitizeLocalPaths = (frame, inventory) => {
  const homedir = require('os').homedir()

  const sanitizers = [
    [frame.python_interpreter, 'PYTHON_INTERPRETER'],
    [PathHelpers.getGantreePath(), 'GANTREE'],
    [homedir, 'HOME']
  ]

  const sanitizeReducer = (v, s) => {
    return v.split(s[0]).join('SANITIZED_' + s[1] + '/')
  }

  return cloneDeepWith(inventory, value => {
    if (typeof value !== 'string') {
      return
    }

    return sanitizers.reduce(sanitizeReducer, value)
  })
}

const run = async () => {
  const sample_path = PathHelpers.getGantreePath('samples')
  const sample_inventory_path = path.join(__dirname, 'sample_inventories')
  const sample_config_files = getSamples()

  sample_config_files.forEach(sample_config => {
    const config_filepath = path.join(sample_path, sample_config)
    const result_filepath = replaceExtension(path.join(sample_inventory_path, sample_config), 'inventory')

    let expected_inventory
    try {
      expected_inventory = StdJson.read(result_filepath)
    } catch (e) {
      console.log(
        `No expected inventory for '${config_filepath}. Invalid inventory json at: '${result_filepath}'`
      )
      expected_inventory = {}
    }

    const raw_gco = StdJson.read(config_filepath)
    const frame = getTestFrame(raw_gco)
    const gco = full_preprocess({ frame, gco: raw_gco })

    const gen_inv = operation.inventory({ frame, gco })

    const san_gen_inv = sanitizeLocalPaths(frame, gen_inv)

    const diff = JsonDiff(expected_inventory, san_gen_inv)

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
