const { Buffer } = require('buffer')
const child_process = require('child_process')
const { Counter } = require('./counter')

const appendBuffer = (buffer, ...data) => {
  Buffer.concat([buffer, ...data.map(Buffer.from)])
}

async function exec(frame, command, options = {}) {
  const logger = frame.logAt({
    service: 'cmd',
    log_to_console: Boolean(options.log_to_console),
    log_to_file: Boolean(options.log_to_file),
    log_to_error_file: Boolean(options.log_to_error_file)
  })

  logger.info(`Executing: ${command}, ${JSON.stringify(options)}`)

  const counter = frame.enable_process_stdout
    ? new Counter(
      null,
      async count => (count % 5 === 0 ? process.stdout.write('.') : null),
      async count => (count >= 5 ? process.stdout.write('\n') : null)
    )
    : new Counter()

  // TODO(ryan): reject on timeout?
  return new Promise(resolve => {
    let out = new Buffer.from('')
    let err = new Buffer.from('')

    const child = child_process.exec(command, options)

    // TODO: evaluate if this is worth re-implementing
    // if (options.detached) {
    //   child.unref()
    //   resolve(child.pid)
    //   return
    // }

    counter.start()

    child.stdout.on('data', data => {
      counter.start()

      logger.info(data)

      out = appendBuffer(out, data)
    })

    child.stderr.on('data', data => {
      counter.start()

      logger.error(data)

      err = appendBuffer(err, data)
    })

    child.on('close', async code => {
      counter.stop()

      if (code !== 0) {
        logger.error(`Execution failed with code ${code}: ${command}`)
      }

      resolve({
        code,
        out: out.toString(),
        err: err.toString()
      })
    })
  })
}

module.exports = {
  exec
}
