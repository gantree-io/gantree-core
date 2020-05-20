const path = require('path')
const fs = require('fs')
const namespace = require('./namespace')
const { inventory: full_inventory } = require('../../reconfig/inventories/full')
const { activateProviders } = require('./activate-providers')
const pathHelpers = require('../../../utils/path-helpers')
const { checkHash } = require('./check-hash')

const StdJson = require('../../../utils/std-json')

async function createInventory(frame, gco) {
  const logger = frame.logAt('lib/ansible/inventory')
  logger.info('creating Gantree inventory')

  activateProviders(frame, gco)

  const inv = full_inventory({ frame, gco })

  writeGantreeInventory(frame, inv)

  checkHash(frame, gco)

  logger.info('Gantree inventory created')
}

const writeGantreeInventory = (frame, inv) => {
  const inventory_tool_filepath = pathHelpers.getToolsPath(
    'gantree-inventory.js'
  )

  const inventory_filepath = path.join(
    frame.project_path,
    'gantreeInventory.json'
  )

  fs.writeFileSync(inventory_filepath, StdJson.stringify(inv), 'utf8')

  const sh_file_content = `#!/bin/bash\n\nnode ${inventory_tool_filepath} ${frame.project_path}`
  const sh_file_path = path.join(frame.active_path, 'gantree.sh')

  fs.writeFileSync(sh_file_path, sh_file_content, 'utf8')
  fs.chmodSync(sh_file_path, '775')
}

async function deleteGantreeInventory(frame) {
  const logger = frame.logAt('lib/ansible/inventory/deleteGantreeInventory')
  // TODO: add extra functionality other than hash delete
  const hash_filepath = await path.join(
    frame.project_path,
    'gantree_config_hash.txt'
  )

  fs.unlinkSync(hash_filepath)
  logger.info('cleared Gantree config hash')
}

function gantreeInventoryExists(frame) {
  const hash_filepath = path.join(frame.project_path, 'gantree_config_hash.txt')

  if (fs.existsSync(hash_filepath)) {
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
