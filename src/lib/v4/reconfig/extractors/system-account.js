const { createExtractor } = require('../creators/create-extractor')

const extract = createExtractor('system-account', () => {
  const system_user = 'subuser' // TODO(ryan): rename to system_user
  const system_group = 'subgroup' // TODO(ryan): rename to system_group
  const system_home = `/home/${system_user}`

  return {
    system_user,
    system_group,
    system_home,
    substrate_user: system_user, // TODO(ryan): deprectated
    substrate_group: system_group, // TODO(ryan): deprecated
  }
})

module.exports = {
  extract
}
