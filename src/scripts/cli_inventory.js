#!/usr/bin/env node
const config = require('../lib/config')
const check = require('../lib/check')
const { inventory } = require('../lib/dataManip/inventory')
const { throwGantreeError } = require('../error')

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

async function main() {
  // TODO: we should consider changing this to just GANTREE_CONFIG_PATH
  const gantreeConfigPath = process.env.GANTREE_INVENTORY_CONFIG_PATH

  if (gantreeConfigPath === undefined) {
    throwGantreeError(
      "ENVIRONMENT_VARIABLE_MISSING",
      Error("GANTREE_INVENTORY_CONFIG_PATH missing, please export the absolute path to your gantree config")
    )
  }

  const gantreeConfigObj = config.read(gantreeConfigPath)

  await config.validate(gantreeConfigObj, { verbose: false })
  await check.envVars(gantreeConfigObj, { verbose: false })

  const inventoryObj = await inventory(gantreeConfigObj)

  process.stdout.write(JSON.stringify(inventoryObj, null, 2))
}

main()
