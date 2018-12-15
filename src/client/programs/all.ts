import {ICommands, ICommandHandler} from '../ICommands'
import {IProgramDef} from './IProgramDef'
import {about} from './about'
import {invert} from './invert'
import {music} from './music'
import {photos} from './photos'
import {snake} from './snake'
import {viewsource} from './viewsource'

const allPrograms: {[name: string]: IProgramDef } = {
  about,
  invert,
  music,
  photos,
  snake,
  viewsource,
}

export const all = Object.keys(allPrograms).reduce((o, key) => {
  const program = allPrograms[key]
  const handler: ICommandHandler = (p, args) => p.fork(program, args)
  const name = program.options && program.options.name
    ? program.options.name
    : key
  o[name] = handler
  return o
}, {} as ICommands)
