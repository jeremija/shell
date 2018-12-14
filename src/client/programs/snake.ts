import {IProgramDef} from './IProgramDef'

export const snake: IProgramDef = {
  commands: {
    '': p => {
      p.output.print('snake')
    },
  },
  options: {
    name: 'snake',
    prefix: 'snake$',
  },
}
