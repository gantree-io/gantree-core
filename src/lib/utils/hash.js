const crypto = require('crypto')

function getChecksum(dataStr, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'sha256')
    .update(dataStr, 'utf8')
    .digest(encoding || 'hex')
}

function validateChecksum(
  frame,
  // dataStr,
  realChecksum,
  expectedChecksum
  //algorithm,
  //encoding
) {
  const logger = frame.logAt('validateChecksum')

  // note: newlines and whitespace considered in checksum
  const hashA = realChecksum
  // const hashA = getChecksum(dataStr, algorithm, encoding)
  const hashB = expectedChecksum

  logger.verbose(`A: ${hashA}`)
  logger.verbose(`B: ${hashB}`)

  if (hashA === hashB) {
    logger.verbose('checksum match.')
    return true
  }

  logger.verbose('checksum mismatch!')
  return false
}

// function getFileChecksum(filePath, algorithm, encoding) {
//     const dataStr = fs.readFileSync(filePath, 'utf-8')
//     return getChecksum(dataStr, algorithm, encoding)
// }

const hash = {
  getChecksum,
  validateChecksum
}

module.exports = {
  hash
}
