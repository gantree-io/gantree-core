#!/usr/bin/env node

const program = require('commander')
const { inject } = require('../../tools/inject')
const { dynamicInject } = require('../../tools/dynamic-inject')

program
  .description('Injects keys into chainspec (non-raw).')
  .option('-c, --chainSpecPath [path]', 'Path to chainSpec file.')
  .option('-v, --validatorSpecPath [path]', 'Path to validatorSpec file.')
  .option('-p, --palletSpecPath [path]', 'Path to palletSpec file.')
  .option(
    '-R, --allow-raw',
    'Allow usage of raw chainSpec (returns raw chainSpec in stdout)',
    false
  )
  .action(inject_CLI)

program.allowUnknownOption(false)

// const parsed = program.parse(process.argv)
program.parse(process.argv)

function inject_CLI(cmd) {
  let allowRaw = false
  if (cmd.chainSpecPath === undefined) {
    throw new Error('chainSpecPath missing')
  }
  if (cmd.validatorSpecPath === undefined) {
    throw new Error('validatorSpecPath missing')
  }
  if (!(cmd.allowRaw === undefined)) {
    allowRaw = cmd.allowRaw
  }

  if (cmd.palletSpecPath === undefined) {
    inject(cmd.chainSpecPath, cmd.validatorSpecPath, allowRaw)
  } else {
    dynamicInject(cmd.chainSpecPath, cmd.validatorSpecPath, cmd.palletSpecPath, allowRaw)
  }
}
