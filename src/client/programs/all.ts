import {ICommands, ICommandHandler} from '../ICommands'
import {IProgram} from './IProgram'
import {about} from './about'
import {invert} from './invert'
import {music} from './music'
import {photos} from './photos'
import {snake} from './snake'
import {viewsource} from './viewsource'

const allProcesss: {[name: string]: IProgram } = {
  about,
  invert,
  music,
  photos,
  snake,
  viewsource,
}

export const all = Object.keys(allProcesss).reduce((o, key) => {
  const program = allProcesss[key]
  const handler: ICommandHandler = (p, args) => p.fork(program, args)
  const name = program.name ? program.name : key
  o[name] = handler
  return o
}, {} as ICommands)
