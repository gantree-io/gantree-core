// Keep namespaced by importing 'checks'!

const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG, INTERNAL_ERROR }
} = require('../../../error/gantree-error')
const { hasOwnProp } = require('../../../utils/has-own-prop')
const { gcoAL } = require('../../schemas/abstract')

function nodeNameCharLimit(frame, gco, _options = {}) {
  const logger = frame.logAt('nodeNameCharLimit')

  const charLimit = _options.charLimit || 18
  const extraAutoChars = _options.extraAutoChars || '-'

  const projectName = gcoAL(gco).get_project_id()
  const nodeCount = gcoAL(gco).get_nodes().length
  const suffixString = extraAutoChars + nodeCount.toString()
  const suffixChars = suffixString.length
  const projectNameMaxChars = charLimit - suffixChars

  logger.debug(`project name: ${projectName}`)
  logger.debug(`node count: ${nodeCount}`)
  logger.debug(`suffix string: '${suffixString}'`)
  logger.debug(`suffix string chars: ${suffixChars}`)

  let name_results = new Map()
  gcoAL(gco)
    .get_nodes()
    .forEach((node_n, index) => {
      if (hasOwnProp(node_n, 'name')) {
        if (node_n.name.length > charLimit) {
          name_results.set(node_n, {
            valid: false,
            method: 'manual',
            index: index
          })
        }
      } else {
        const resolvedNameLength = projectName.length + suffixChars
        if (resolvedNameLength > charLimit) {
          name_results.set(node_n, {
            valid: false,
            method: 'generated',
            index: index
          })
        }
      }
    })
  if (name_results.size > 0) {
    name_results.forEach((results, node_n) => {
      if (results.method === 'manual') {
        const excessChars = node_n.name.length - charLimit
        logger.error(
          `Node[${results.index}]: Name is ${excessChars} chars too long. Max node name is ${charLimit} chars.`
        )
      } else if (results.method === 'generated') {
        const excessChars = projectName.length - projectNameMaxChars
        logger.error(
          `Node[${results.index}]: Project name is ${excessChars} chars too long to generate a node name. For ${nodeCount} nodes, project name max is ${projectNameMaxChars} chars.`
        )
      } else {
        throw new GantreeError(
          INTERNAL_ERROR,
          'Node name method not recognized'
        )
      }
    })
    throw new GantreeError(BAD_CONFIG, 'Project name or node name/s too long')
  }
}

module.exports = {
  nodeNameCharLimit
}
