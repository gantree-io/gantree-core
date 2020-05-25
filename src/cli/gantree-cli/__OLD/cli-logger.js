const winston = require('winston')
const { format } = winston
const { combine, timestamp, label, printf, colorize } = format

const consoleFormat = printf(
  ({ level, message, label, timestamp, service }) => {
    return `${timestamp} [${label}] (${service}) ${level}: ${message}`
  }
)

const meta_filter = name =>
  format(info => (info[name] !== false ? info : false))()

const create = options => {
  const service = options.service || 'Gantree'
  const level = options.level || 'info'
  const error_log_file = options.error_log_file || 'gantree-error.log'
  const combined_log_file = options.combined_log_file || 'gantree-combined.log'

  const logger = winston.createLogger({
    level,
    ///format: winston.format.json(),
    transports: []
  })

  if (options.log_to_console) {
    const console_transport = new winston.transports.Console({
      format: combine(
        meta_filter('log_to_console'),
        colorize(),
        label({ label: service }),
        timestamp(),
        consoleFormat
      )
    })

    logger.add(console_transport)
  }

  if (options.error_log_file) {
    logger.add(
      new winston.transports.File({
        filename: error_log_file,
        level: 'error',
        format: combine(meta_filter('log_to_error_file'))
      })
    )
  }

  if (options.combined_log_file) {
    logger.add(
      new winston.transports.File({
        filename: combined_log_file,
        format: combine(meta_filter('log_to_combined_file'))
      })
    )
  }

  return logger
}

module.exports = {
  create
}
