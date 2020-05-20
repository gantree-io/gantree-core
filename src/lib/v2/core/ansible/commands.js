const cmd = require('../../services/cmd')
const pathHelpers = require('../../../utils/path-helpers')

const ensureArray = item => (Array.isArray(item) ? item : [item])

const getInventorySubstring = inv_paths =>
  ensureArray(inv_paths)
    .map(p => `-i ${p}`)
    .join(' ')

const getPlaybookFilepath = filename =>
  pathHelpers.getGantreePath('src', 'lib', 'v2', 'playbooks', filename)

async function runPlaybook(frame, playbook_filename) {
  const logger = frame.logAt('ansible/commands/runPlaybook')
  logger.info(`running playbook: ${playbook_filename}`)

  const playbook_filepath = getPlaybookFilepath(playbook_filename)

  const inventory_substring = getInventorySubstring([frame.active_path])

  const playbook_command = `ansible-playbook ${inventory_substring} ${playbook_filepath}`

  const execOutput = await cmd.exec(playbook_command, { verbose: true })

  logger.info(`playbook finished: ${playbook_filepath}`)

  return execOutput
}

async function returnCombinedInventory(frame) {
  const logger = frame.logAt('ansible/commands/returnCombinedInventory')
  logger.info(`...getting generated ansible inventory`)

  const inventory_path_substring = await getInventorySubstring([
    frame.active_path
  ])

  const inventory_command = `ansible-inventory ${inventory_path_substring} --list`

  const cmd_output_buffer = await cmd.exec(inventory_command, {
    verbose: false,
    returnStdoutOnly: true,
    returnCleanStdout: true
  })
  const cmd_output = await cmd_output_buffer.toString()
  const inventory_obj = await JSON.parse(cmd_output)

  logger.info(`...got generated ansible inventory!`)

  return inventory_obj
}

module.exports = {
  runPlaybook,
  returnCombinedInventory
}
