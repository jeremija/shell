import {IProgramOptions} from '../Program'
import {ICommands} from '../ICommands'

export interface IProgramDef {
  commands: ICommands
  options: Partial<IProgramOptions> & { name: string }
}
