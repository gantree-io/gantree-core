const { extract: Ansible } = require('../extractors/gantree')

const inventory = invProps => ({
  _meta: {
    hostvars: {}
  },
  local: {
    hosts: ['localhost'],
    vars: {
      ansible_python_interpreter: invProps.frame.python_interpreter,
      ansible_connection: 'local',
      ...Ansible.node(invProps)
    }
  }
})

module.exports = {
  inventory
}
