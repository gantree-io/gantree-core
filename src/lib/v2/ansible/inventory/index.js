const path = require('path')
const fs = require('fs')
const namespace = require('./namespace')
const { inventory: full_inventory } = require('../../reconfig/inventories/full')
const {
  activateProviders
} = require('../../ansible/inventory/activate-providers')
const { hash } = require('../../../utils/hash')
const envPython = require('../../../utils/env-python')
const { ensurePath, getGantreePath } = require('../../../utils/path-helpers')
const {
  GantreeError,
  ErrorTypes: { BAD_CHECKSUM }
} = require('../../../gantree-error')

const StdJson = require('../../../utils/std-json')

async function createInventory(frame, gco) {
  const logger = frame.logAt('lib/ansible/inventory')
  logger.info('creating Gantree inventory')

  const python_interpreter = await envPython.getInterpreterPath()

  activateProviders(frame, gco)

  const inv = full_inventory({
    frame,
    gco,
    project_path: frame.project_path,
    python_interpreter
  })

  writeGantreeInventory(frame, inv)

  checkHash(frame, gco)

  logger.info('Gantree inventory created')
}

const writeGantreeInventory = (frame, inv) => {
  const project_path = frame.project_path

  const active_path = ensurePath(project_path, 'active')

  const gantree_path = getGantreePath()

  const inventory_file_path = path.join(project_path, 'gantreeInventory.json')

  fs.writeFileSync(inventory_file_path, StdJson.stringify(inv), 'utf8')

  const sh_file_content = `#!/bin/bash\n\nnode ${gantree_path}/src/cli/tools-cli/gantree-inventory.js ${project_path}`
  const sh_file_path = path.join(active_path, 'gantree.sh')

  fs.writeFileSync(sh_file_path, sh_file_content, 'utf8')
  fs.chmodSync(sh_file_path, '775')
}

const checkHash = (frame, gco) => {
  const logger = frame.logAt('lib/ansible/inventory/checkHash')
  const { strict, project_path } = frame

  const inventory_path = path.join(project_path, 'gantree')
  const hash_path = path.join(inventory_path, 'gantree_config_hash.txt')

  const gcoString = StdJson.stringify(gco)
  const gcoHash = hash.getChecksum(gcoString)
  const prevHashExists = fs.existsSync(hash_path, 'utf-8')

  if (prevHashExists === true) {
    // logger.info('Gantree config hash found')
    const expectedHash = fs.readFileSync(hash_path, 'utf-8')
    const valid = hash.validateChecksum(gcoHash, expectedHash)
    if (valid === true) {
      logger.info('Gantree config hash valid')
      return
    }

    if (strict === true) {
      throw new GantreeError(
        BAD_CHECKSUM,
        `Config hash changed in strict mode, old '${expectedHash}', new '${gcoHash}'`
      )
    } else {
      logger.warn(
        `Config hash changed, old '${expectedHash}', new: '${gcoHash}'`
      )
    }
  }

  // logger.info('No Gantree config hash found')
  const gantreeConfigObjHash = hash.getChecksum(gcoString)

  fs.writeFileSync(hash_path, `${gantreeConfigObjHash} `, 'utf8')
  logger.info(`Gantree config hash written(${gantreeConfigObjHash})`)
}

async function deleteGantreeInventory(frame) {
  const logger = frame.logAt('lib/ansible/inventory/deleteGantreeInventory')
  // TODO: add extra functionality other than hash delete
  const projectPath = frame.project_path
  const gantreeInventoryPath = await path.join(projectPath, 'gantree')
  const gantreeConfigHashTxtFilePath = await path.join(
    gantreeInventoryPath,
    'gantree_config_hash.txt'
  )

  fs.unlinkSync(gantreeConfigHashTxtFilePath)
  logger.info('cleared Gantree config hash')
}

function gantreeInventoryExists(projectPath) {
  const gantreeInventoryPath = path.join(projectPath, 'gantree')
  const gantreeConfigHashTxtFilePath = path.join(
    gantreeInventoryPath,
    'gantree_config_hash.txt'
  )

  if (fs.existsSync(gantreeConfigHashTxtFilePath)) {
    return true
  }

  return false
}

module.exports = {
  namespace,
  createInventory,
  deleteGantreeInventory,
  gantreeInventoryExists
}
