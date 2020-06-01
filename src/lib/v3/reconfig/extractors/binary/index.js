const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../../error/gantree-error')
const { createExtractor } = require('../../creators/create-extractor')

const { extract: BinaryFetch } = require('./binary-fetch')
const { extract: BinaryRepository } = require('./binary-repository')
const { extract: BinaryGeneral } = require('./binary-general')
const { extract: BinaryLocal } = require('./binary-local')
const { extract: BinaryOptions } = require('./binary-options')


const extract = createExtractor('binary', props => {
  return {
    ...BinaryFetch.node(props),
    ...BinaryRepository.node(props),
    ...BinaryGeneral.node(props),
    ...BinaryLocal.node(props),
    ...BinaryOptions.node(props)
  }
})

module.exports = {
  extract
}
