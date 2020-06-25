
const Ansible = require('../ansible')
const StdJson = require('../../../utils/std-json')
const Logger = require('../../../logging/logger')
const Frame = require('../../core/frame')
const {
  inventory: gantreeInventory
} = require('../../reconfig/inventories/full')

const logger = Logger.create({
  console_log: false,
  null_transport: true
})

async function main(context_path) {
  try {
    const { gco, frame: serialized_frame } = StdJson.read(context_path)

    // TODO(ryan): why is strict not being serialized
    const frame = Frame.createFrame({ ...serialized_frame, logger, gco, strict: false })

    const base = await Ansible.commands.returnCombinedInventory(frame)

    const inv = gantreeInventory({ frame, gco, base })

    console.log(StdJson.stringify(inv))
  } catch (e) {
    console.log(StdJson.stringify({}))
  }
}

module.exports = {
  main
}
