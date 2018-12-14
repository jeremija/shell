import * as c from './constants'
import {ICommands} from './ICommands'
import {Input} from './Input'
import {Output} from './Output'

type ICallback = (args: any) => void

interface IListener {
  event: string
  fn: ICallback
}

export class Program {
  protected listeners: IListener[] = []
  protected exited = false

  constructor(
    protected readonly input: Input,
    protected readonly output: Output,
    protected readonly commands: ICommands,
    protected readonly exitCallback: () => void,
    protected readonly autoExit = true,
  ) {
    this.listen()
  }
  autocomplete(input: string): string[] {
    return Object.keys(this.commands).filter(k => k.startsWith(input))
  }
  protected addListener(event: string, fn: ICallback) {
    this.input.on(event, fn)
    this.listeners.push({ event, fn })
  }
  protected handleCommand(command: string, args: string[]): boolean {
    if (!this.commands.hasOwnProperty(command)) {
      this.output.error('Invalid command:', command)
      return false
    }
    this.commands[command](this.output, args)
    return true
  }
  handleEnter = (input: string) => {
    this.output.print('$ ' + input)
    const args = input.split(' ')
    const command = args[0]
    this.handleCommand(command, args.slice(1))
    if (this.autoExit) {
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
  listen() {
    this.addListener(c.EVENT_INPUT_ENTER, this.handleEnter)
    this.addListener(c.EVENT_INPUT_TAB, this.handleAutocomplete)
  }
  cleanup() {
    this.listeners.forEach(({ event, fn }) =>
      this.input.removeListener(event, fn))
    this.listeners = []
  }
  exit() {
    this.cleanup()
    this.exited = true
    this.exitCallback()
  }
  hasQuit() {
    return this.exited
  }
}
