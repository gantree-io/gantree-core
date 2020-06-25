const validator = require('./validators/validate')
const { processor: full_preprocess } = require('./preprocessors/full')

const preprocess = (frame, gco) => full_preprocess({ frame, gco })

const validate = (frame, gco) => validator.config(frame, gco)

module.exports = {
  preprocess,
  validate
}
