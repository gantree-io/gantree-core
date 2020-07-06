
const merge = require('lodash.merge')
const Ansible = require('../ansible')
const StdJson = require('../../../utils/std-json')
const Logger = require('../../../logging/logger')
const Frame = require('../../core/frame')
const {
  inventory: gantreeInventory
} = require('../../reconfig/inventories/full')

const rootLogger = Logger.create({
  log_file: "/home/rozifus/Desktop/logggyyy.1",
  console_log: false,
  null_transport: true
})

async function main(context_path) {
  let gco, frame, logger


  try {
    const context = StdJson.read(context_path)
    gco = context.gco

    // TODO(ryan): why is strict not being serialized
    frame = Frame.createFrame({ ...context.frame, logger: rootLogger, gco, strict: false })
    logger = frame.logAt('overtory-entry')

    const base = await Ansible.commands.returnActiveInventory(frame)

    //logger.info('base')
    //logger.info(base)

    const inv = gantreeInventory({ frame, gco, base })

    //logger.info('base')
    //logger.info(base)

    //const ips = Ansible.extract.IPs(frame, base)

    //logger.info(ips)

    //const setup = await Ansible.commands.runSetup(frame, ips)

    //logger.info(setup)

    // TODO(ryan): maybe integrate base through inv
    const combined = merge(base, inv)
    logger.info(")))combo(((")
    logger.info(combined)

    console.log(StdJson.stringify(combined))
  } catch (e) {
    logger.info(`error: '${e}', ${e.message}, ${e.stack}`)
    console.log(StdJson.stringify({}))
  }
}

module.exports = {
  main
}
