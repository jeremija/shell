import {IProgramDef} from './IProgramDef'
import {link} from '../util'

export const snake: IProgramDef = {
  commands: {
    '': p => {
      p.output.print(link('https://steiner.website/snake'))
    },
  },
  options: {
    name: 'snake',
    prefix: 'snake$',
  },
}
