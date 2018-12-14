import * as c from './constants'
import {ICommands} from './ICommands'
import {IProgramDef} from './programs/IProgramDef'
import {Input} from './Input'
import {Logger} from './Logger'
import {OS} from './OS'
import {Output} from './Output'
import {argsToMap} from './util'

const logger = new Logger('shell:program')

type ICallback = (args: any) => void

interface IListener {
  event: string
  fn: ICallback
}

export interface IProgramOptions {
  name: string
  autoExit: boolean
  prefix: string
}

const defaultOptions: IProgramOptions = {
  name: '<unnamed>',
  autoExit: true,
  prefix: '$',
}

export class Program {
  protected listeners: IListener[] = []
  protected exited = false
  protected readonly options: IProgramOptions
  protected readonly commands: ICommands
  public readonly name: string

  constructor(
    readonly input: Input,
    readonly output: Output,
    readonly os: OS,
    protected readonly programDef: IProgramDef,
  ) {
    this.options = Object.assign({}, defaultOptions, programDef.options)
    this.commands = programDef.commands
    this.name = this.options.name
    this.attach()
  }
  autocomplete(input: string): string[] {
    return Object.keys(this.commands).filter(k => k.startsWith(input))
  }
  start() {
    logger.log('[%s]: start', this.name)
    if (this.commands.hasOwnProperty('')) {
      this.handleEnter('')
    }
  }
  protected addListener(event: string, fn: ICallback) {
    logger.log('[%s] adding listener "%s"', this.name, event)
    this.input.on(event, fn)
    this.listeners.push({ event, fn })
  }
  protected handleCommand(command: string, args: string[]): boolean {
    if (!this.commands.hasOwnProperty(command)) {
      this.output.error('Invalid command:', command)
      return false
    }
    this.commands[command](this, args, argsToMap(args))
    return true
  }
  handleEnter = (input: string) => {
    logger.log('[%s] handleEnter: "%s"', this.name, input)
    this.output.print('$ ' + input)
    const args = input.replace(/' {2,}/, ' ').trim().split(' ')
    const command = args[0]
    this.handleCommand(command, args.slice(1))
    if (this.options.autoExit) {
      this.exit()
    }
  }
  handleAutocomplete = (input: string) => {
    const values = this.autocomplete(input)
    if (!values.length) {
      return
    }
    if (values.length === 1) {
      this.input.setValue(values[0])
      return
    }
    this.output.print('$ ' + this.input.getValue())
    this.output.print(values.join('   '))
  }
  attach() {
    logger.log('[%s] %s', this.name, 'attach')
    this.addListener(c.EVENT_INPUT_ENTER, this.handleEnter)
    this.addListener(c.EVENT_INPUT_TAB, this.handleAutocomplete)
    this.input.setPrefix(this.options.prefix)
  }
  detach() {
    logger.log('%s: %s', this.name, 'detach')
    this.listeners.forEach(({ event, fn }) => {
      logger.log('[%s] removing listener "%s"', this.name, event)
      this.input.removeListener(event, fn)
    })
    this.listeners = []
  }
  exit() {
    this.detach()
    this.exited = true
    this.os.notifyExit()
  }
  hasQuit() {
    return this.exited
  }
}
