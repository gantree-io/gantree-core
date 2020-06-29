const { Gantree } = require('../../../lib')
const { gantreeTitle } = require('../support/art')
const { processCommandArgs } = require('./command-args')
const { handleErr } = require('../../../lib/error/gantree-error')

const wrapper = command => async args => {
  console.log(gantreeTitle)

  try {
    const processedArgs = await processCommandArgs(args)

    await Gantree.run({
      ...args, // NOTE(Denver): check if this is needed
      ...processedArgs,
      command
    })
  } catch (e) {
    handleErr(undefined, e)
  }
}

module.exports = {
  syncWrapper: wrapper('sync'),
  cleanWrapper: wrapper('clean')
}
