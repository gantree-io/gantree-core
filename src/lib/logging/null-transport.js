const Transport = require('winston-transport')

module.exports = class NullTransport extends Transport {
  constructor(opts) {
    super(opts)
  }

  log(info, callback) {
    callback()
  }
}
