const { GraphQLClient } = require('graphql-request')
const { gcoAL } = require('../../schemas/abstract')

const API_IP = 'localhost' // TODO(Denver): this shouldn't be static
const API_PORT = '4000' // TODO(Denver): this shouldn't be static

/**
 * @param {*} gco - Gantree config object
 * @returns {GraphQLClient}
 */
const get_gql_client = gco => {
  // pull api key out of config
  const api_key = gcoAL(gco).get_api_key() // TODO(Denver): this should probably be done somewhere else
  // establish client connection
  return new GraphQLClient(`http://${API_IP}:${API_PORT}`, {
    headers: { authorization: `Api-Key ${api_key}` }
  })
}

module.exports = {
  get_gql_client
}
