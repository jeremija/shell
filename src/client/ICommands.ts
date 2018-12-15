import {Process} from './Process'
import {IMapOfBool} from './util'

export type ICommandHandler = (
  program: Process,
  args: string[],
  argsMap: IMapOfBool,
) => void

export interface ICommands {
  [command: string]: ICommandHandler
}
