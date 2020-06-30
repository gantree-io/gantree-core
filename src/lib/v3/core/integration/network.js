const { get_gql_client } = require('./client')
const queries = require('./queries')
const { gcoAL } = require('../../schemas/abstract')

const sync_network = async gco => {
  console.log('--SYNC NETWORK')
  const client = get_gql_client(gco)

  // config containing config version and info for nodes (which is stringified?)
  // IPs of nodes paired with (indexes?)
  // api key from (processed config?)

  // build and send query
  console.log('--SYNC REQUEST')
  const response = await client
    .request(
      queries.syncNetwork, // <----- THIS IS THE RIGHT ONE
      {
        project_id: gcoAL(gco).get_project_id(),
        platform: 'EXTERNAL-CORE',
        network_args: JSON.stringify({
          binary_args: {
            method: gcoAL(gco).get_binary_method(),
            filename: gcoAL(gco).get_binary_filename()
            // repository_method: repository_method,
            // fetch_method: fetch_method,
            // local_method: local_method,
            // preset_method: preset_method,
            // filename: filename
          }
        })
      }
      // queries.addCliNetwork, // <---- FOR DEBUGGING
      // {
      //   cli_nodes: JSON.stringify([
      //     { cfgIndex: 0, name: "my-node-name", ip: "186.100.33.41" }
      //   ]),
      //   config: JSON.stringify(gco)
      // }
    )
    .catch(e => {
      console.log('----API ERROR!!!----')
      console.log(e.message)
    })
  return response
}

const find_network = async gco => {
  const client = get_gql_client(gco)

  // build and send query
  const response = await client
    .request(
      // queries.fetchAllNetworks, // <---- FOR DEBUGGING
      queries.networkByProjectId, // <---- RIGHT ONE
      { project_id: gcoAL(gco).get_project_id() } // <---- RIGHT ONE
    )
    .catch(e => {
      console.log('----API ERROR!!!----')
      console.log(JSON.stringify(e, ' ', 4).replace(/\\n/g, '\n'))
    })
  return response
}

const get_all_networks = async gco => {
  const client = get_gql_client(gco)
  const response = await client.request(queries.fetchAllNetworks).catch(e => {
    console.log('----API ERROR!!!----')
    console.log(JSON.stringify(e, ' ', 4).replace(/\\n/g, '\n'))
  })
  return response
}

module.exports = {
  sync: sync_network,
  find: find_network,
  get_all: get_all_networks,
  del: async (gco, id) => {
    const client = get_gql_client(gco)

    // build and send query
    const response = await client
      .request(queries.deleteCliNetwork, { _id: id })
      .catch(e => {
        console.log('----API ERROR!!!----')
        console.log(JSON.stringify(e, ' ', 4).replace(/\\n/g, '\n'))
      })
    return response
  }
}
