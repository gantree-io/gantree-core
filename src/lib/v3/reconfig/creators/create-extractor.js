const createExtractor = (extractor_name, extractor_func) => {
  if (typeof extractor_name !== 'string') {
    extractor_func = extractor_name
    extractor_name = 'unnamed_extractor'
  }

  if (typeof extractor_func !== 'function') {
    throw Error(`invalid parameters ('${extractor_name}', '${extractor_func}')`)
  }

  const node = props => {
    const { gco, index } = props
    const nco = (gco && gco.nodes && gco.nodes[index]) || {}
    return extractor_func({ ...props, nco, index })
  }

  const all = props => {
    const { gco } = props
    return (
      (gco &&
        gco.nodes.map((nco, index) =>
          extractor_func({ ...props, nco, index })
        )) ||
      []
    )
  }

  return {
    node,
    all
  }
}

module.exports = {
  createExtractor
}
