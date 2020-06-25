const path = require('path')
const fs = require('fs')

const { ensurePath } = require('../../../utils/path-helpers')
const {
  inventory: gantreeInventory
} = require('../../reconfig/inventories/full')
const { activateProviders } = require('./activate-providers')
const { checkHash } = require('./check-hash')

const StdJson = require('../../../utils/std-json')


async function createInventory(frame, gco) {
  const logger = frame.logAt('lib/ansible/inventory')
  logger.info('creating Gantree inventory')

  activateProviders(frame, gco)

  writeOvertoryScript(frame, gco)
  // const inv = gantreeInventory({ frame, gco })

  // writeGantreeInventory(frame, inv)

  checkHash(frame, gco)

  logger.info('Gantree inventory created')
}

const writeOvertoryScript = (frame, gco) => {
  const logger = frame.logAt('lib/ansible/writeOvertoryScript')
  logger.info('write overtory script')

  const overtory_path = ensurePath(frame.project_path, 'overtory')

  const context = {
    frame: frame.serializable(),
    gco
  }

  const context_file_path = path.join(overtory_path, 'context.json')
  fs.writeFileSync(context_file_path, StdJson.stringify(context), 'utf8')

  const entry_file_path = path.join(__dirname, 'overtory-entry.js')

  const sh_file_content = `#!/bin/bash\n\nnode ${entry_file_path} ${context_file_path}; echo "tok:$DO_API_TOKEN";`
  const sh_file_path = path.join(frame.project_path, 'overtory.sh')
  fs.writeFileSync(sh_file_path, sh_file_content, 'utf8')
  fs.chmodSync(sh_file_path, '775')

  const js_file_content = `#!/usr/bin/env node

    'use strict'

    const entry = require('${entry_file_path}')

    async function run() {
      try {
        await entry.main('${context_file_path}')
      } catch (e) {
        console.log(e)
      }
    }

    run()
  `

  const js_file_path = path.join(frame.project_path, 'overtory.js')
  fs.writeFileSync(js_file_path, js_file_content, 'utf8')
  fs.chmodSync(js_file_path, '775')
}

const writeGantreeInventory = (frame, inv) => {
  const logger = frame.logAt('lib/ansible/writeGantreeInventory')
  logger.info('write gantree inventory')

  const inventory_filepath = path.join(
    frame.project_path,
    'gantree_inventory.json'
  )

  fs.writeFileSync(inventory_filepath, StdJson.stringify(inv), 'utf8')

  const sh_file_content = `#!/bin/bash\n\ncat ${inventory_filepath} `
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
  createInventory,
  deleteGantreeInventory,
  gantreeInventoryExists
}
