
const path = require('path')
const { diff: JsonDiff } = require('json-diff')

const StdJson = require('../../../utils/std-json')
const PathHelpers = require('../../../utils/path-helpers')

const { createTestInventory, getFileSets } = require('./shared')

const runTest = () => {
  const config_root = PathHelpers.getGantreePath('samples')
  const inventory_root = path.join(__dirname, 'sample_inventories')

  const file_sets = getFileSets(config_root, inventory_root)

  file_sets.forEach(file_set => {
    const { config_path, config_data, inventory_path, inventory_data } = file_set

    console.log(`#### ${config_path} ####`)

    if (!config_data) {
      console.log(`Error reading config '${config_path}`)
      return
    }

    const gen_inventory_data = createTestInventory(config_data)

    if (!inventory_data) {
      console.log(`Error reading inventory '${inventory_path}`)
      return
    }

    const diff = JsonDiff(inventory_data, gen_inventory_data)

    if (diff) {
      console.log(StdJson.stringify(diff, null, 2))
    } else {
      console.log('NO CHANGE')
    }
    console.log()
  })
}

runTest()
