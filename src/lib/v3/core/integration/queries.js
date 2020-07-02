module.exports = {
  addCliNetwork: `
    mutation addCliNetwork($cli_nodes: String! $config: String!) {
        addCliNetwork(cli_nodes: $cli_nodes config: $config)
    }
    `,
  deleteCliNetwork: `
    mutation deleteCliNetwork($_id: String!) {
        deleteCliNetwork(_id: $_id)
    }
    `,
  fetchAllNetworks: `
    query networks {
        networks {
            _id
            project_id
            nodes{
                _id
                name
                ip
                provider
                status
                validator
            }
        }
    }
    `,
  syncNetwork: `
    mutation syncNetwork($project_id: String! $platform: String! $network_args: String!) {
        syncNetwork(project_id: $project_id platform: $platform network_args: $network_args)
    }
    `,
  networkByProjectId: `
    query networkByProjectId($project_id: String!) {
        networkByProjectId(project_id: $project_id) {
            _id
            project_id
            nodes{
                _id
                name
                ip
                provider
                status
                validator
            }
        }
    }`
}
