const { BaseError } = require('make-error-cause')

const _error_meta = require('./error-meta.json')

const generic_error = _error_meta.errors.GENERIC_ERROR

class GantreeError extends BaseError {
  constructor(
    meta = generic_error,
    message = generic_error.message,
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
  const logger = frame.logAt('handleErr')
  if (typeof err !== GantreeError) {
    err = new GantreeError(generic_error, err)
  }
  logger.error(`FAIL:[${err.meta.code}] ${err.meta.message}: ${err.message}`)
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
