
const fs = require('fs')
const path = require('path')
const merge = require('lodash.merge')
const Ansible = require('../ansible')
const StdJson = require('../../../utils/std-json')
const Logger = require('../../../logging/logger')
const IpAddresses = require('./ip-addresses')
const { getHosts } = require('./gantree-node-inventory')
const Frame = require('../../core/frame')
const { ensurePath } = require('../../../utils/path-helpers')
const { inventory: FullInventory } = require('../../reconfig/inventories/full')
const { inventory: SetupInventory } = require('../../reconfig/inventories/setup')



const INVENTORIES = {
  'full': FullInventory
}

const build_echo_inventory_dynamic_inventory = inventory => {
  if (typeof inventory !== 'string') {
    inventory = StdJson.stringify(inventory)
  }

  return `#!/usr/bin/env node

  const content=\`${inventory}\`

  console.log(content)
  `
}

async function main(context_path) {
  let gco, frame, inventory_name

  try {
    const context = StdJson.read(context_path)

    gco = context.gco

    inventory_name = context.inventory_name
    if (!inventory_name) {
      throw new Error('no inventory name')
    }

    const rootLogger = Logger.create({
      log_file: path.join(context.frame.project_path, "overtory_log.log"),
      error_log_file: path.join(context.frame.project_path, "overtory_error_log.log"),
      console_log: false,
      level: 'debug'
    })

    const selected_inventory = INVENTORIES[context.inventory_name]

    // TODO(ryan): why is strict not being serialized
    frame = Frame.createFrame({ ...context.frame, logger: rootLogger, gco, strict: false, enable_process_stdout: false })
    const logger = frame.logAt('overtory-entry')

    const active = await Ansible.returnActiveInventory(frame)

    const setup_inventory = SetupInventory({ gco, frame, base: active, active })
    //logger.debug(setup_inventory)

    const overtory_path = ensurePath(frame.project_path, 'overtory')

    const setup_inventory_path = path.join(overtory_path, 'setup.js')

    const setup_inventory_content = build_echo_inventory_dynamic_inventory(setup_inventory)

    fs.writeFileSync(setup_inventory_path, setup_inventory_content, 'utf8')
    fs.chmodSync(setup_inventory_path, '775')

    //const hosts = getHosts(frame, active)

    const sf_res = await Ansible.runPlaybookForJson(frame, 'sode_facts.yml', [setup_inventory_path], true)

    const sf_play = sf_res && sf_res.plays && sf_res.plays[0]
    const sf_task = sf_play && sf_play.tasks && sf_play.tasks[0]
    const sf_hosts = sf_task && sf_task.hosts

    //logger.debug('sf_task')
    //logger.debug(sf_task)

    let sode_facts
    try {
      sode_facts = Object.entries(sf_hosts).reduce((acc, [host, data]) => Object.assign(acc, { [host]: data.ansible_facts.ansible_local }), {})
    } catch (e) {
      sode_facts = {}
    }


    //logger.debug('sode_facts')
    //logger.debug(sode_facts)

    const inv = selected_inventory({ frame, gco, active, base: active, sode_facts })


    //const hosts = inv.hostname_ip_pairs

    //const setup = await Ansible.runSetup(frame)

    //logger.info('base')
    //logger.info(base)

    //const inv = gantreeInventory({ frame, gco, base })

    //logger.info('base')
    //logger.info(base)

    //const ips = IpAddresses.extract(frame, base)

    //logger.info(ips)

    //const setup = await Ansible.commands.runSetup(frame, ips)

    //logger.info(setup)

    // TODO(ryan): maybe integrate base through inv
    const combined = merge(active, inv)
    //logger.info(")))combo(((")
    //logger.info(combined)

    console.log(StdJson.stringify(combined))
  } catch (e) {
    const errorOut = `error: '${e}', ${e.message}, ${e.stack} `
    console.error(errorOut)
  }
}

module.exports = {
  main
}
