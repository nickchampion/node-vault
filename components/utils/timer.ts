export default class {
  start: number

  constructor() {
    this.start = new Date().valueOf()
  }

  elasped() {
    return `${new Date().valueOf() - +this.start}ms since start`
  }

  stop() {
    return new Date().valueOf() - +this.start
  }
}
