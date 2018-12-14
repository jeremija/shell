import {ICommands, ICommandHandler} from '../ICommands'
import {IProgramDef} from './IProgramDef'
import {snake} from './snake'

const allPrograms: {[name: string]: IProgramDef } = {snake}

const programs = Object.keys(allPrograms).reduce((o, key) => {
  const program = allPrograms[key]
  const handler: ICommandHandler = p => p.os.startProgram(program)
  o[key] = handler
  return o
}, {} as ICommands)

const help = `This is a list of the most useful commands:
  exit  - exits an application (you cannot exit the main shell)
  clear - clears the output
  help  - shows this text
  ls    - lists available programs

Use the [TAB] key to autocomplete entry
Use the [UP] and [DOWN] keys to go through previous commands
Most commands accept the standard --help argument for instructions
For example: ls --help`

export const shell: IProgramDef = {
  commands: {
    help: p => p.output.print(help),
    clear: p => p.output.clear(),
    exit: p => p.exit(),
    ls: (p, args, argsMap) => {
      if (argsMap['-l']) {
        p.output.print(Object.keys(programs).join('\n'))
      } else {
        p.output.print(Object.keys(programs).join('    '))
      }
    },
    ...programs,
  },
  options: {
    name: 'shell',
    autoExit: false,
    prefix: '$',
  },
}
