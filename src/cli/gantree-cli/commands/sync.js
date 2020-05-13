const { Gantree } = require('../../../lib')
const { gantreeTitle } = require('../support/art')
const { processCommandArgs } = require('./command-args')

async function syncWrapper(args) {
  console.log(gantreeTitle)

  const processedArgs = await processCommandArgs(args)

  // TODO(ryan): try/catch
  await Gantree.run({
    ...args,
    ...processedArgs,
    command: 'sync'
  })
}

module.exports = {
  syncWrapper
}
