import {ICreatableProgram} from './programs/IProgram'
import {IInput} from './Input'
import {IOutput} from './Output'
import {Process} from './Process'
import {shell} from './programs/shell'
import {Logger} from './Logger'

const logger = new Logger('shell:os')

export class OS {
  protected stack: Process[] = []

  constructor(
    protected readonly input: IInput,
    protected readonly output: IOutput,
  ) {
    this.createShell()
  }

  notifyExit(pid: number) {
    this.stack = this.stack.filter(p => p.pid !== pid)
    logger.log('-- OS -- notifyExit activeProcesses: %s',
      this.stack.map(p => p.name))
    const alreadyAttached = this.stack.some(p => p.isAttached())
    if (!alreadyAttached) {
      this.activateProcess()
    }
  }

  async startProcess(
    Program: ICreatableProgram,
    args: string[] = [],
  ) {
    logger.log('-- OS -- startProcess: [%s] %s', Program.name, args)
    const activeProcess = this.getActiveProcess()
    if (activeProcess) {
      logger.log('-- OS -- detach %s', activeProcess.name)
      activeProcess.detach()
    }
    const process = new Process(
      this.input,
      this.output,
      this,
      Program,
    )
    this.stack.push(process)
    await process.start(args)
    return process
  }

  protected activateProcess(): void {
    const program = this.getActiveProcess()
    if (!program) {
      this.createShell()
      return
    }
    program.attach()
  }

  protected getActiveProcess(): Process | undefined {
    return this.stack[this.stack.length - 1]
  }

  protected createShell() {
    this.startProcess(shell)
  }
}
