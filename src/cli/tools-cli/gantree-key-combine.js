#!/usr/bin/env node

const program = require('commander')
const { keyCombine } = require('../../tools/key-combine')
const { Utils } = require('../../lib')

program
  .description(
    'Combines multiple validator key yaml into a single validator key json file.'
  )
  .option(
    '-d, --directory [path]',
    'Path to session directory.',
    `${Utils.getOperationsPath()}/gantree_host/session`
  )
  .action(keyCombine_CLI)

program.allowUnknownOption(false)

// const parsed = program.parse(process.argv)
program.parse(process.argv)

async function keyCombine_CLI(cmd) {
  if (cmd.directory === undefined) {
    throw new Error('Path to the session directory missing')
  }
  keyCombine(cmd.directory)
}
