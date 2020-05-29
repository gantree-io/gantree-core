const { createExtractor } = require('../creators/create-extractor')

const extract = createExtractor('system-account', () => ({
  substrate_user: 'subuser', // TODO(ryan): rename to system_user
  substrate_group: 'subgroup' // TODO(ryan): rename to system_group
}))

module.exports = {
  extract
}
