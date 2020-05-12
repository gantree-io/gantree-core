const { Gantree } = require('../../lib')
const { gantreeTitle } = require('./art')
const { processCommandArgs } = require('./processCommandArgs')

async function cleanWrapper(args) {
  console.log(gantreeTitle)

  const processedArgs = processCommandArgs(args)

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
