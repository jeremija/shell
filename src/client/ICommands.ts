import {Program} from './Program'

export type ICommandHandler = (output: Program, args: string[]) => void

export interface ICommands {
  [command: string]: ICommandHandler
}
