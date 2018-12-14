import {Output} from './Output'

export interface ICommands {
  [command: string]: (output: Output, args: string[]) => void
}
