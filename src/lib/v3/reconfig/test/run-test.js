const path = require('path')
const { diff: JsonDiff } = require('json-diff')

const StdJson = require('../../../utils/std-json')
const PathHelpers = require('../../../utils/path-helpers')
const col = require('../../../utils/colours')

const { createTestInventory, getFileSets } = require('./shared')

const COLOUR_OUTPUT = true

const colour_diff = diff_str => {
  let output = ''
  diff_str.split('\n').forEach(line => {
    if (line.includes('__added')) {
      output += col.fg.green + '+' + line.replace('__added', '') + col.reset
    } else if (line.includes('__deleted')) {
      output += col.fg.red + '-' + line.replace('__deleted', '') + col.reset
    } else if (line.includes('__old')) {
      output += col.fg.red + '-' + line + col.reset
    } else if (line.includes('__new')) {
      output += col.fg.green + '+' + line + col.reset
    } else {
      output += '.' + line
    }
    output += '\n'
  })
  return output
}

const runTest = () => {
  const config_root = PathHelpers.getGantreePath('samples/v3')
  const inventory_root = path.join(__dirname, 'sample_inventories')

  const file_sets = getFileSets(config_root, inventory_root)

  file_sets.forEach(file_set => {
    const {
      config_path,
      config_data,
      inventory_path,
      inventory_data
    } = file_set

    const filename_header = `#### ${config_path} ####`
    console.log(filename_header)
    if (COLOUR_OUTPUT) {
      console.log(col.fg.blue + '.'.repeat(filename_header.length) + col.reset)
    }

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
      let diff_str = StdJson.stringify(diff, null, 2)
      if (COLOUR_OUTPUT) {
        diff_str = colour_diff(diff_str)
      }
      console.log(diff_str)
    } else {
      console.log('NO CHANGE')
    }
    console.log()
  })
}

runTest()
