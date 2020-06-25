//todo: cleanup for lib-centric approach
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const managePlugin = (gco, invPath) => {
  const projects = getGcpProjects(gco)

  const gcpInvPath = path.join(invPath, 'gcp.yml')

  if (fs.existsSync(gcpInvPath)) {
    fs.unlinkSync(gcpInvPath)
  }

  if (projects.length > 0) {
    const gcpInv = createGcpInventory({ projects })
    fs.writeFileSync(gcpInvPath, gcpInv, 'utf8')
  }
}

const getGcpProjects = gco => {
  const projects = []
  gco.nodes.forEach(n => {
    if (n.instance.provider != 'gcp') {
      return
    }
    if (!n.instance.projectId) {
      return
    }
    if (projects.includes(n.instance.projectId)) {
      return
    }

    projects.push(n.instance.projectId)
  })
  return projects
}

const createGcpInventory = vars => {
  const inv = {
    plugin: 'gcp_compute',
    projects: vars.projects || [],
    hostnames: ['public_ip'],
    keyed_groups: [
      {
        key: "tags['items']",
        separator: ''
      }
    ],
    compose: {
      ansible_host: 'networkInterfaces[0].accessConfigs[0].natIP'
    },
    filters: []
  }

  return yaml.safeDump(inv)
}

module.exports = {
  managePlugin
}
