import {Program} from './Program'
import {IMapOfBool} from './util'

export type ICommandHandler = (
  output: Program,
  args: string[],
  argsMap: IMapOfBool,
) => void

export interface ICommands {
  [command: string]: ICommandHandler
}
