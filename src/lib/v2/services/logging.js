const winston = require('winston')

const { combine, timestamp, label, printf, colorize } = winston.format

const myFormat = printf(({ level, message, label, timestamp, service }) => {
  return `${timestamp} [${label}] (${service}) ${level}: ${message}`
})

const createLogger = (opts = {}) => {
  const service_name = opts.service_name || 'Gantree'
  const level = opts.level || 'info'
  const error_log_file = opts.error_log_file || 'error.log'
  const combined_log_file = opts.combined_log_file || 'combined.log'

  const logger = winston.createLogger({
    level,
    format: winston.format.json(),
    defaultMeta: { service: service_name },
    transports: [
      new winston.transports.File({ filename: error_log_file, level: 'error' }),
      new winston.transports.File({ filename: combined_log_file })
    ]
  })
  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: combine(
          colorize(),
          label({ label: service_name }),
          timestamp(),
          myFormat
        )
      })
    )
  }
  return logger
}

module.exports = {
  returnLogger: createLogger
}
