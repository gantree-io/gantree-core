const { rawRead } = require('../utils/raw-read')
const validate = require('../reconfig/validators/validate')
const { extract: extractMetadata } = require('../reconfig/extractors/metadata')
const { processor: full_preprocess } = require('../reconfig/preprocessors/full')

// const { returnLogger } = require('../logging')

// const logger = returnLogger('config')

class Config {
  constructor() {
    // assign private imported stuff
    this._rawRead = rawRead
    //this._preprocess = preprocess
    // assign public imported stuff
    this.validate = validate
    //this.extract = extract
    // bind own methods
    this.getProjectName = this.getProjectName.bind(this)
    this.read = this.read.bind(this)
  }

  async read(rawFilePath) {
    let gco = await this._rawRead(rawFilePath)
    await this.validate.config(gco)
    gco = full_preprocess({ gco })
    return gco
  }

  getProjectName(gco) {
    const { project_name } = extractMetadata({ gco })
    return project_name
  }
}

module.exports = {
  Config
}