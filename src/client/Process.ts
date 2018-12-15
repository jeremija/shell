import * as c from './constants'
import {ICommands} from './ICommands'
import {ICreatableProgram, IProgram} from './programs/IProgram'
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

export interface IProcessOptions {
  autoExit: boolean
  prefix: string
}

const defaultOptions: IProcessOptions = {
  autoExit: true,
  prefix: '$',
}

let pid = 0

export class Process {
  protected listeners: IListener[] = []
  protected attached = false
  protected exited = false
  protected readonly program: IProgram
  protected readonly options: IProcessOptions
  protected readonly commands: ICommands
  public readonly name: string
  public autoExit: boolean
  public readonly pid: number
  public readonly namePid: string

  constructor(
    readonly input: Input,
    readonly output: Output,
    protected readonly os: OS,
    protected readonly Program: ICreatableProgram,
  ) {
    this.pid = ++pid
    if (typeof Program === 'function') {
      this.program = new Program()
    } else {
      this.program = Program
    }

    this.program = typeof Program === 'function'
      ? new Program()
      : Program
    this.options = Object.assign({}, defaultOptions, this.program.options)
    this.commands = this.program.commands
    this.autoExit = this.options.autoExit
    this.name = this.program.name
    this.namePid = this.name + ':' + this.pid
    this.attach()
  }
  autocomplete(input: string): string[] {
    return Object.keys(this.commands).filter(k => k.startsWith(input))
  }
  async start(args: string[]) {
    logger.log('[%s]: start, args: %o', this.namePid, args)

    if (args.length >= 2) {
      await this.safeHandleCommand(args[1], args)
    } else if (this.program.commands.hasOwnProperty('')) {
      await this.safeHandleCommand('', args)
    } else {
      this.maybeExit()
    }
  }
  fork(program: ICreatableProgram, args: string[]) {
    logger.log('[%s] fork [%s] %s', this.namePid, program.name, args)
    try {
      this.os.startProcess(program, args)
    } catch (err) {
      this.output.error(err.message)
    }
  }
  protected addListener(event: string, fn: ICallback) {
    logger.log('[%s] adding listener "%s"', this.namePid, event)
    this.input.on(event, fn)
    this.listeners.push({ event, fn })
  }
  protected async handleCommand(command: string, args: string[]) {
    logger.log('[%s] handleCommand: %s %o', this.namePid, command, args)
    if (!this.commands.hasOwnProperty(command)) {
      throw new Error('Illegal argument: ' + command)
    }
    await this.commands[command](this, args, argsToMap(args.slice(1)))
  }
  protected async safeHandleCommand(command: string, args: string[]) {
    try {
      await this.handleCommand(command, args)
    } catch (err) {
      this.output.error(err.message)
    } finally {
      this.maybeExit()
    }
  }
  handleEnter = async (input: string) => {
    logger.log('[%s] handleEnter: "%s"', this.namePid, input)
    if (print) {
      this.output.print(this.options.prefix + ' ' + input)
    }
    const args = input.replace(/' {2,}/, ' ').trim().split(' ')
    const command = args[0]
    await this.safeHandleCommand(command, args)
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
    if (this.exited) {
      throw new Error('Cannot attach a program that has quit: ' +
        this.namePid + ' (pid: ' + this.pid + ')')
    }
    if (this.attached) {
      throw new Error('This program is already attached! pid: ' + this.namePid)
    }
    logger.log('[%s] %s', this.namePid, 'attach')
    this.addListener(c.EVENT_INPUT_ENTER, this.handleEnter)
    this.addListener(c.EVENT_INPUT_TAB, this.handleAutocomplete)
    this.input.setPrefix(this.options.prefix)
    this.attached = true
  }
  detach() {
    logger.log('[%s] %s', this.namePid, 'detach')
    this.listeners.forEach(({ event, fn }) => {
      logger.log('[%s] removing listener "%s"', this.namePid, event)
      this.input.removeListener(event, fn)
    })
    this.listeners = []
    this.attached = false
  }
  maybeExit() {
    if (this.autoExit) {
      this.exit()
    }
  }
  stayOpen() {
    logger.log('[%s] stayOpen')
    this.autoExit = false
  }
  exit() {
    logger.log('[%s] exit', this.namePid)
    this.detach()
    this.exited = true
    this.os.notifyExit(this.pid)
  }
  hasQuit() {
    return this.exited
  }
  isAttached() {
    return this.attached
  }
}
