const opt = require('../../utils/options')

/**
 * Gantree configuration object abstraction layer.
 *
 * Provides a set of methods for extracting specific data from config object in a standard way.
 *
 * The benefit of this is that any changes to the config schema only need to be reflected here.
 * @param {*} gco - Gantree configuration object
 */
const gcoAL = gco => {
  return {
    gco,
    get_api_key: function() {
      return opt.default(
        this.gco.integration && this.gco.integration.apiKey,
        null
      )
    },
    get_project_id: function() {
      return this.gco.metadata.project
    },
    get_nodes: function() {
      return this.gco.nodes
    },
    get_binary_method: function() {
      return (
        (this.gco.binary.repository && 'repository') ||
        (this.gco.binary.fetch && 'fetch') ||
        (this.gco.binary.local && 'local') ||
        null
      )
    },
    get_binary_filename: function() {
      return this.gco.binary.filename
    },
    get_config_version: function() {
      return this.gco.metadata.version
    },
    get_fetch_method_url: function() {
      return this.gco.binary.fetch.url
    },
    get_binary_chain: function() {
      return this.gco.binary.chain
    },
    get_is_using_bin_chainspec: function() {
      return this.gco.binary.useBinChainSpec
    },
    get_node_name: function(index) {
      return this.gco.nodes[index].name
    },
    get_node_instance: function(index) {
      return this.gco.nodes[index].instance
    },
    get_node_type: function(index) {
      return this.gco.nodes[index].validator ? 'VALIDATOR' : 'FULL'
    },
    get_node_pallet_options: function(index) {
      return this.gco.nodes[index].palletOptions
    },
    get_node_binary_options: function(index) {
      return this.gco.nodes[index].binaryOptions
    },
    get_instance_private_key_alias: function(index) {
      return this.gco.nodes[index].instance.sshPrivateKeyAlias
    },
    get_instance_ssh_user: function(index) {
      return this.gco.nodes[index].instance.sshUser // TODO(Denver): we need a way to see how reconfig handles this default
    },
    get_instance_provider: function(index) {
      return this.gco.nodes[index].instance.provider
    }
  }
}

module.exports = {
  gcoAL
}
