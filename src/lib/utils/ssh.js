const fs = require('fs-extra')
const forge = require('node-forge')
const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../error/gantree-error')

function publicKeyFromPrivateKeyPath(privateKeyPath) {
  // throw error if path undefined
  if (privateKeyPath === undefined) {
    throw new GantreeError(
      BAD_CONFIG,
      'private key path is undefined on one or more nodes'
    )
  }

  let privateKey

  // handle error if reading file failed
  try {
    privateKey = fs.readFileSync(privateKeyPath)
  } catch (e) {
    throw new GantreeError(BAD_CONFIG, 'failed to read private key', e)
  }

  const forgePrivateKey = forge.pki.privateKeyFromPem(privateKey)
  const forgePublicKey = forge.pki.setRsaPublicKey(
    forgePrivateKey.n,
    forgePrivateKey.e
  )

  return forge.ssh.publicKeyToOpenSSH(forgePublicKey).trim()
}

module.exports = {
  publicKeyFromPrivateKeyPath
}
