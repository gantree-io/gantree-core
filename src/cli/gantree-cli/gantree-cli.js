#!/usr/bin/env node

const program = require('commander')
const packageMeta = require('../../package/package-meta')
const { syncWrapper, cleanWrapper } = require('./commands/operations')

function returnVersionString() {
  const name = packageMeta.getName()
  const version = packageMeta.getVersion()
  return `gantree-cli | ${name} ${version}`
}

const standardCommand = (name, desc, func) => {
  return program
    .command(name)
    .description(desc)
    .option('-c, --config [config] (required)', 'Path to config file.')
    .option(
      '-s, --strict',
      'Fail instead of printing warnings on some operations (e.g. hash validation)'
    )
    .option('-p, --project [project]', 'Force project path (advanced usage)')
    .option(
      '-i, --inventory [inventory]',
      'Force inventory path (advanced usage)'
    )
    .action(func)
}

program.version(returnVersionString())

standardCommand(
  'sync',
  'Create/update infrastructure based on Gantree configuration.',
  syncWrapper
)
standardCommand(
  'clean',
  'Destroy existing infrastructure based on Gantree configuration.',
  cleanWrapper
)

program.allowUnknownOption(false)

const parsed = program.parse(process.argv)
if (
  !parsed ||
  !(
    parsed.args &&
    parsed.args.length > 0 &&
    typeof (parsed.args[0] === 'object')
  )
) {
  program.outputHelp()
}
