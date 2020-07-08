const cmd = require('../../services/cmd')
const path = require('path')
const pathHelpers = require('../../../utils/path-helpers')
const StdJson = require('../../../utils/std-json')

const ensureArray = item => (Array.isArray(item) ? item : [item])
const ARG_HARD_FAIL = 'ANSIBLE_INVENTORY_UNPARSED_FAILED=1'

const getInventorySubstring = inv_paths =>
  ensureArray(inv_paths)
    .map(p => `-i ${p}`)
    .join(' ')

const getPlaybookFilepath = filename =>
  pathHelpers.getGantreePath('src', 'lib', 'v4', 'playbooks', filename)

async function runPlaybook(frame, playbook_filename) {
  const logger = frame.logAt('ansible/commands/runPlaybook')
  logger.info(`running playbook: ${playbook_filename}`)

  const playbook_filepath = getPlaybookFilepath(playbook_filename)

  const inventory_substring = getInventorySubstring([path.join(frame.project_path, 'overtory.js')])

  const playbook_command = `${ARG_HARD_FAIL} ansible-playbook ${inventory_substring} ${playbook_filepath}`
  //const playbook_command = `${path.join(frame.project_path, 'overtory.sh')}`

  const result = await cmd.exec(frame, playbook_command, {
    log_to_console: true,
    log_to_file: true,
    log_to_error_file: true
  })

  logger.info(`playbook finished: ${playbook_filepath}`)

  return result
}

async function runInventory(frame, sources = []) {
  const logger = frame.logAt('ansible/commands/ansibleInventory')
  logger.debug(`...getting generated ansible inventory`)

  const inventory_substring = getInventorySubstring(sources)

  const inventory_command = `${ARG_HARD_FAIL} ansible-inventory ${inventory_substring} --list`

  logger.debug(`running inventory command: '${inventory_command}'`)

  const exec_result = await cmd.exec(frame, inventory_command)

  const inventory = StdJson.parse(exec_result.out)

  logger.debug(`...got generated ansible inventory!`)
  logger.debug(inventory)

  return inventory
}

async function returnActiveInventory(frame) {
  return await runInventory(frame, [frame.active_path])
}

async function returnOvertoryInventory(frame) {
  return await runInventory(frame, [path.join(frame.project_path, 'overtory.js')])
}

async function returnOvertoryDirect(frame) {
  const logger = frame.logAt('ansible/runOvertoryDirect')
  logger.debug(`...getting overtory`)

  const overtory_path = path.join(frame.project_path, 'overtory.js')

  const exec_result = await cmd.exec(frame, overtory_path)

  const inventory = StdJson.parse(exec_result.out)

  logger.debug(`...got generated ansible inventory!`)
  logger.debug(inventory)

  return inventory
}

const getInventorySubstringFromHosts = (hosts = []) => {
  const s = ensureArray(hosts)
    .map(p => `${p}, `)
    .join('')

  if (s == '') {
    throw new Error("No hosts provided")
  }

  return `-i ${s}`
}

const ARG_JSON_STDOUT = 'ANSIBLE_STDOUT_CALLBACK=json'

/* The setup command collects facts about a host, including custom facts */
async function runSetup(frame, hosts = []) {
  const logger = frame.logAt('ansible/commands/runSetup')
  logger.info(`...getting ansible output as json`)

  const playbook_filepath = getPlaybookFilepath('setup.yaml')

  const inventory_substring = getInventorySubstringFromHosts(hosts)

  const playbook_command = `${ARG_HARD_FAIL} ${ARG_JSON_STDOUT} ansible-playbook ${inventory_substring} ${playbook_filepath}`

  logger.debug(`running playbook command: '${playbook_command}'`)

  const exec_result = await cmd.exec(frame, playbook_command)

  logger.debug(exec_result)

  const setupResult = StdJson.parse(exec_result.out)

  logger.info(`...got json playbook(setup) output!`)

  return setupResult
}

module.exports = {
  runPlaybook,
  runInventory,
  runSetup,
  returnActiveInventory,
  returnOvertoryInventory,
  returnOvertoryDirect
}
