import debug from 'debug'

export class Logger {
  protected readonly logger: debug.IDebugger
  constructor(name: string) {
    this.logger = debug(name)
  }
  log(formatter: any, ...args: any[]) {
    this.logger.call(null, formatter, ...args)
  }
}
