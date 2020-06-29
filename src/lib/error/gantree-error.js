const { BaseError } = require('make-error-cause')

const _error_meta = require('./error-meta.json')

const GENERIC_ERROR = _error_meta.errors.GENERIC_ERROR

class GantreeError extends BaseError {
  constructor(
    meta = GENERIC_ERROR,
    message = GENERIC_ERROR.message,
    cause = undefined // instance of Error caught
  ) {
    super(message, cause)

    this.code = meta.code
    this.meta = meta
  }
}

const ErrorTypes = {}
for (const error_name of Object.keys(_error_meta.errors)) {
  ErrorTypes[error_name] = _error_meta.errors[error_name]
}

const handleErr = (frame, err, throwErr = false) => {
  if (err.meta === undefined || err.message === undefined) {
    err = new GantreeError(GENERIC_ERROR, 'vanilla error: see error below', err)
  }

  const err_msg = `FAIL:[${err.meta.code}] ${err.meta.message}: ${err.message}`

  if (frame !== undefined) {
    const logger = frame.logAt('handleErr')
    logger.error(err_msg)
  } else {
    console.log(err_msg)
  }

  if (throwErr == true) {
    throw err
  } else {
    console.log(err)
    process.exit(err.code)
  }
}

module.exports = {
  GantreeError,
  ErrorTypes,
  handleErr
}
