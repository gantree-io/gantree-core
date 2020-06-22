// const fs = require('fs')
const path = require('path')
const cloneDeepWith = require('lodash.clonedeepwith')

const StdJson = require('../../../utils/std-json')
const PathHelpers = require('../../../utils/path-helpers')
const Logger = require('../../../logging/logger')
const { createFrame } = require('../../core/frame')
const operation = require('../inventories/operation')
const { processor: full_preprocess } = require('../preprocessors/full')

const SAMPLE_SUBPATHS = require('./sample-subpaths')

const replaceExtension = (filename, new_ext) =>
  [...filename.split('.').slice(0, -1), new_ext].join('.')

const getTestFrame = gco => {
  const DRIFT_TEST_PRIVATE_KEY_PATH = path.join(
    __dirname,
    'test-assets',
    'drift_test_private_key'
  )

  return createFrame({
    logger: Logger.create({
      service_name: 'Reconfig Tests',
      null_transport: true
    }),
    project_path: `${PathHelpers.getOperationsPath()}/gantree-test-project/`,
    control_root: `${PathHelpers.getOperationsPath()}/gantree-test-control/`,
    strict: false,
    gco,
    env: {
      DRIFT_TEST_PRIVATE_KEY_PATH,
      GANTREE_INSTANCE_PRIVATE_KEY_PATH: DRIFT_TEST_PRIVATE_KEY_PATH,
      GCP_PROJECT_NAME: 'GCP_PROJECT_TEST_VALUE'
    }
  })
}

// const getFilesWithExtension = (files_path, ext) => {
//   if (typeof ext !== 'string' || ext.trim() === "") {
//     throw Error('extension must be type string')
//   }

//   return fs.readdirSync(files_path)
//     .filter(filename => path.extname(filename) === '.' + ext)
//     .map(filename => path.join(files_path, filename))
// }

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

const readJsonOrNull = file_path => {
  try {
    return StdJson.read(file_path)
  } catch (e) {
    return null
  }
}

const getFileSets = (config_root, inventory_root) => {
  return SAMPLE_SUBPATHS.map(sample => {
    const config_path = path.join(config_root, sample)
    const inventory_path = replaceExtension(
      path.join(inventory_root, sample),
      'inventory'
    )

    return {
      config_path,
      config_data: readJsonOrNull(config_path),
      inventory_path,
      inventory_data: readJsonOrNull(inventory_path)
    }
  })
}

const createTestInventory = raw_gco => {
  const frame = getTestFrame(raw_gco)

  const gco = full_preprocess({ frame, gco: raw_gco })

  const gen_inv = operation.inventory({ frame, gco })

  const san_gen_inv = sanitizeLocalPaths(frame, gen_inv)

  return san_gen_inv
}

module.exports = {
  getFileSets,
  createTestInventory
}
