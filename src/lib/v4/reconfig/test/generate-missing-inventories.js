
const path = require('path')

const StdJson = require('../../../utils/std-json')
const PathHelpers = require('../../../utils/path-helpers')

const { getFileSets, createTestInventory } = require('./shared')


const generateMissingTestInventories = () => {
  const config_root = PathHelpers.getGantreePath('samples')
  const inventory_root = path.join(__dirname, 'sample_inventories')

  const file_sets = getFileSets(config_root, inventory_root)

  file_sets.forEach(file_set => {
    const { config_path, config_data, inventory_path, inventory_data } = file_set

    if (!config_data) {
      console.log(`Error getting config '${config_path}`)
      return
    }

    const new_inventory_data = createTestInventory(config_data)

    if (!inventory_data) {
      console.log(`CREATING... '${inventory_path}'`)
      StdJson.write(inventory_path, new_inventory_data)
    } else {
      console.log(`skipping... '${inventory_path}'`)

    }
  })
}

generateMissingTestInventories()
