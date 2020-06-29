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
    }
  }
}

module.exports = {
  gcoAL
}
