import {Input} from './Input'
import {Output} from './Output'
import {Program} from './Program'
import {shell} from './programs/shell'

export class OS {
  protected program: Program

  constructor(
    protected readonly input: Input,
    protected readonly output: Output,
  ) {
    this.program = this.createShell()
  }

  handleExit = () => {
    this.program = this.createShell()
  }

  createShell() {
    return new Program(this.input, this.output, shell, this.handleExit)
  }
}
