const { Gantree } = require('../../../lib')
const { gantreeTitle } = require('../support/art')
const { processCommandArgs } = require('./command-args')

const wrapper = command => async args => {
  console.log(gantreeTitle)

  try {
    const processedArgs = await processCommandArgs(args)

    await Gantree.run({
      ...args,
      ...processedArgs,
      command
    })
  } catch (e) {
    let err = e
    while (err) {
      console.log(err.message)
      err = err.cause
    }
    process.exit(1)
  }
}

module.exports = {
  syncWrapper: wrapper('sync'),
  cleanWrapper: wrapper('clean')
}
