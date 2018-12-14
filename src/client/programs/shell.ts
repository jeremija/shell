import {ICommands} from '../ICommands'

const help = `This is a list of the most useful commands:
  exit  - exits an application (you cannot exit the main shell)
  clear - clears the output
  help  - shows this text
  ls    - lists available programs

Use the [TAB] key to autocomplete entry
Use the [UP] and [DOWN] keys to go through previous commands
Most commands accept the standard --help argument for instructions
For example: ls --help`

export const shell: ICommands = {
  help: o => o.print(help),
  clear: o => o.clear(),
}
