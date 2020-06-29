// Keep namespaced by importing 'checks'!

const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../../error/gantree-error')
const { hasOwnProp } = require('../../../utils/has-own-prop')

async function nodeNameCharLimit(frame, gco, _options = {}) {
  const logger = frame.logAt('nodeNameCharLimit')

  const charLimit = _options.charLimit || 18
  const extraAutoChars = _options.extraAutoChars || '-'

  const projectName = gco.metadata.project
  const nodeCount = gco.nodes.length
  const suffixString = extraAutoChars + nodeCount.toString()
  const suffixChars = suffixString.length

  logger.debug(`project name: ${projectName}`)
  logger.debug(`node count: ${nodeCount}`)
  logger.debug(`suffix string: '${suffixString}'`)
  logger.debug(`suffix string chars: ${suffixChars}`)

  gco.nodes.forEach(node_n => {
    // if node has name
    if (hasOwnProp(node_n, 'name')) {
      // check name isn't over max
      if (node_n.name > charLimit) {
        throw new GantreeError(
          BAD_CONFIG,
          `Node name too long ('${node_n.name}'). Max node name length is ${charLimit}.`
        )
      } else {
        return true
      }
    } else {
      // check project name + suffix isn't over max
      const resolvedNameLength = projectName.length + suffixChars
      if (resolvedNameLength > charLimit) {
        const projectNameMaxChars = charLimit - suffixChars
        const projectNameExcessChars = projectName.length - projectNameMaxChars
        throw new GantreeError(
          BAD_CONFIG,
          `Project name is ${projectNameExcessChars} characters too long. For ${nodeCount} node/s, max project name length is ${projectNameMaxChars} characters.`
        )
      } else {
        return true
      }
    }
  })
}

module.exports = {
  nodeNameCharLimit
}
