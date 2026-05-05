export default class Timer {
  start: number

  constructor() {
    this.start = Date.now()
  }

  elasped() {
    return `${Date.now() - +this.start}ms since start`
  }

  stop() {
    return Date.now() - +this.start
  }
}
