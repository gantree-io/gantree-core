const { Gantree } = require('../../../lib')
const { gantreeTitle } = require('../support/art')
const { processCommandArgs } = require('./command-args')

async function cleanWrapper(args) {
  console.log(gantreeTitle)

  const processedArgs = await processCommandArgs(args)

  // TODO(ryan): try/catch
  await Gantree.run({
    ...args,
    ...processedArgs,
    command: 'clean'
  })
}

module.exports = {
  cleanWrapper
}
