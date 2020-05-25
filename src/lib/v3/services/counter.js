
const nullfunc = function () { }

class Counter {
  constructor(on_start = nullfunc, on_increment = nullfunc, on_stop = nullfunc) {
    this.count = 0
    this.on_start = on_start || nullfunc
    this.on_increment = on_increment || nullfunc
    this.on_stop = on_stop || nullfunc
    this.interval = null
  }

  increment = () => {
    this.count++
    this.on_increment(this.count)
  }

  clear = () => {
    if (this.interval) {
      clearInterval(this.interval)
    }
    this.count = 0
  }

  start = () => {
    this.stop()
    this.interval = setInterval(this.increment, 1000)
    this.on_start(this.count)
  }

  stop = () => {
    this.on_stop(this.count)
    this.clear()
  }
}

module.exports = {
  Counter
}
