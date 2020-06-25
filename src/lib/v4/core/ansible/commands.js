const cmd = require('../../services/cmd')
const path = require('path')
const pathHelpers = require('../../../utils/path-helpers')
const StdJson = require('../../../utils/std-json')

const ensureArray = item => (Array.isArray(item) ? item : [item])

const getInventorySubstring = inv_paths =>
  ensureArray(inv_paths)
    .map(p => `-i ${p}`)
    .join(' ')

const getPlaybookFilepath = filename =>
  pathHelpers.getGantreePath('src', 'lib', 'v3', 'playbooks', filename)

async function runPlaybook(frame, playbook_filename) {
  const logger = frame.logAt('ansible/commands/runPlaybook')
  logger.info(`running playbook: ${playbook_filename}`)

  const playbook_filepath = getPlaybookFilepath(playbook_filename)

  const inventory_substring = getInventorySubstring([path.join(frame.project_path, 'overtory.js')])

  const playbook_command = `ansible-playbook ${inventory_substring} ${playbook_filepath}`
  //const playbook_command = `${path.join(frame.project_path, 'overtory.sh')}`

  const result = await cmd.exec(frame, playbook_command, {
    log_to_console: true,
    log_to_file: true,
    log_to_error_file: true
  })

  logger.info(`playbook finished: ${playbook_filepath}`)

  return result
}

async function returnCombinedInventory(frame) {
  const logger = frame.logAt('ansible/commands/returnCombinedInventory')
  logger.info(`...getting generated ansible inventory`)

  const inventory_path_substring = await getInventorySubstring([
    frame.active_path
  ])

  const inventory_command = `ansible-inventory ${inventory_path_substring} --list`

  const exec_result = await cmd.exec(frame, inventory_command)

  logger.info(StdJson.stringify(exec_result))
  const inventory = await JSON.parse(exec_result.out)

  logger.info(`...got generated ansible inventory!`)

  return inventory
}

async function returnAnsibleJson(frame, playbook_filename) {
  const logger = frame.logAt('ansible/commands/json')
  logger.info(`...getting ansible output as json`)

  const playbook_filepath = getPlaybookFilepath(playbook_filename)

  const inventory_substring = getInventorySubstring([frame.active_path])

  const playbook_command = `ANSIBLE_STDOUT_CALLBACK=json ansible-playbook ${inventory_substring} ${playbook_filepath}`

  const exec_result = await cmd.exec(frame, inventory_command)

  const inventory = await JSON.parse(exec_result.out)

  logger.info(`...got json playbook output!`)

  return inventory
}

module.exports = {
  runPlaybook,
  returnCombinedInventory
}
