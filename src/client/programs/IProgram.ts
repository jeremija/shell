import {IProcessOptions} from '../Process'
import {ICommands} from '../ICommands'

export interface IProgram {
  readonly name: string
  readonly commands: ICommands
  readonly options?: Partial<IProcessOptions>
}

export interface IProgramConstructor {
  new(): IProgram
}

export type ICreatableProgram = IProgram | IProgramConstructor
