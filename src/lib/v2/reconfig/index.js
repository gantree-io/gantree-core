const validator = require('./validators/validate')
const { processor: full_preprocess } = require('./preprocessors/full')

const preprocess = gco => full_preprocess({ gco })

const validate = gco => validator.config(gco)

module.exports = {
  preprocess,
  validate
}
