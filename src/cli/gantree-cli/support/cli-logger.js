const winston = require('winston')

const { combine, timestamp, label, printf, colorize } = winston.format

const myFormat = printf(({ level, message, label, timestamp, service }) => {
  return `${timestamp} [${label}] (${service}) ${level}: ${message}`
})

const create = options => {
  const service_name = options.service_name || 'Gantree'
  const level = options.level || 'info'
  const error_log_file = options.error_log_file || 'error.log'
  const combined_log_file = options.combined_log_file || 'combined.log'
  const log_to_console = options.log_to_console || false

  const logger = winston.createLogger({
    level,
    format: winston.format.json(),
    defaultMeta: { service: service_name },
    transports: []
  })

  if (log_to_console) {
    const console_transport = new winston.transports.Console({
      format: combine(
        colorize(),
        label({ label: service_name }),
        timestamp(),
        myFormat
      )
    })

    logger.add(console_transport)
  }

  if (options.error_log_file) {
    logger.add(
      new winston.transports.File({ filename: error_log_file, level: 'error' })
    )
  }

  if (options.combined_log_file) {
    logger.add(new winston.transports.File({ filename: combined_log_file }))
  }

  return logger
}

module.exports = {
  create
}
