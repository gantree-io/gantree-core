const winston = require('winston')
const NullTransport = require('./null-transport')
const { format } = winston
const { combine, timestamp, label, printf, colorize } = format

const getValidLevels = () => {
  return {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7
  }
}
const getDefaultLevel = () => {
  return 'info'
}

const consoleFormat = printf(
  // ({ level, message, label, timestamp, service }) => { return `${timestamp} [${label}] (${service}) ${level}: ${message}` },
  ({ level, message }) => {
    return `${level} ${message}`
  }
)

const meta_filter = name =>
  format(info => (info[name] === false ? false : info))()

const create = options => {
  // TODO(ryan): add logging to socket
  const service = options.service || 'Gantree'
  const level = options.level || 'info'
  const console_log = options.console_log === true
  const log_file = options.log_file || false
  const error_log_file = options.error_log_file || false
  const null_transport = options.null_transport || false

  const logger = winston.createLogger({
    level,
    transports: []
  })

  if (console_log) {
    logger.add(
      new winston.transports.Console({
        format: combine(
          meta_filter('log_to_console'),
          colorize(),
          label({ label: service }),
          timestamp(),
          consoleFormat
        )
      })
    )
  }

  if (log_file) {
    logger.add(
      new winston.transports.File({
        filename: log_file,
        level,
        format: combine(meta_filter('log_to_file'))
      })
    )
  }

  if (error_log_file) {
    logger.add(
      new winston.transports.File({
        filename: error_log_file,
        level: 'error',
        format: combine(meta_filter('log_to_error_file'))
      })
    )
  }

  if (null_transport) {
    logger.add(new NullTransport())
  }

  return logger
}

module.exports = {
  create,
  getValidLevels,
  getDefaultLevel
}
