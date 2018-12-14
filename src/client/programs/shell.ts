import {IProgramDef} from './IProgramDef'

import {all} from './all'

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
      if (argsMap['-h'] || argsMap['--help']) {
        p.output.print(`usage: ls [-l]

list registered programs
optional arguments:
  -l shows programs in a list`)
        return
      }
      if (argsMap['-l']) {
        p.output.print(Object.keys(all).join('\n'))
      } else {
        p.output.print(Object.keys(all).join('    '))
      }
    },
    ...all,
  },
  options: {
    name: 'shell',
    autoExit: false,
    prefix: '$',
  },
}
