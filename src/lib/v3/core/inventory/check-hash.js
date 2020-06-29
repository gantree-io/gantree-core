const path = require('path')
const fs = require('fs')
const { hash } = require('../../../utils/hash')
const {
  GantreeError,
  ErrorTypes: { BAD_CHECKSUM }
} = require('../../../error/gantree-error')

const StdJson = require('../../../utils/std-json')

const checkHash = (frame, gco) => {
  const logger = frame.logAt('inventory/checkHash')
  const { strict, project_path } = frame

  const hash_path = path.join(project_path, 'gantree_config_hash.txt')

  const gcoString = StdJson.stringify(gco)
  const gcoHash = hash.getChecksum(gcoString)
  const prevHashExists = fs.existsSync(hash_path, 'utf-8')

  if (prevHashExists === true) {
    logger.info('Gantree config hash found')
    const expectedHash = fs.readFileSync(hash_path, 'utf-8')
    const valid = hash.validateChecksum(frame, gcoHash, expectedHash)
    if (valid === true) {
      logger.info('Gantree config hash valid')
      return
    }

    if (strict === true) {
      throw new GantreeError(
        BAD_CHECKSUM,
        `Config hash changed in strict mode, old '${expectedHash}', new '${gcoHash}'`
      )
    }

    logger.warn(`Config hash changed, old '${expectedHash}', new: '${gcoHash}'`)
  }

  // logger.info('No Gantree config hash found')
  const gantreeConfigObjHash = hash.getChecksum(gcoString)

  fs.writeFileSync(hash_path, `${gantreeConfigObjHash} `, 'utf8')
  logger.info(`Gantree config hash written (${gantreeConfigObjHash})`)
}

module.exports = {
  checkHash
}
