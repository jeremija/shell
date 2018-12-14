import {IProgramDef} from './programs/IProgramDef'
import {Input} from './Input'
import {Output} from './Output'
import {Program} from './Program'
import {shell} from './programs/shell'
import {Logger} from './Logger'

const logger = new Logger('shell:os')

export class OS {
  protected stack: Program[] = []

  constructor(
    protected readonly input: Input,
    protected readonly output: Output,
  ) {
    this.createShell()
  }

  notifyExit() {
    this.stack.pop()
    logger.log('-- OS -- notifyExit activePrograms: %s',
      this.stack.map(p => p.name))
    this.activateProgram()
  }

  startProgram(programDef: IProgramDef) {
    const activeProgram = this.getActiveProgram()
    if (activeProgram) {
      logger.log('-- OS -- detach %s', activeProgram.name)
      activeProgram.detach()
    }
    const program = new Program(
      this.input,
      this.output,
      this,
      programDef,
    )
    this.stack.push(program)
    logger.log('-- OS -- startProgram: %s', this.stack.map(p => p.name))
    program.start()
    return program
  }

  protected activateProgram(): void {
    const program = this.getActiveProgram()
    if (!program) {
      this.createShell()
      return
    }
    program.attach()
  }

  protected getActiveProgram(): Program | undefined {
    return this.stack[this.stack.length - 1]
  }

  protected createShell() {
    this.startProgram(shell)
  }
}
