import {IProgram} from './IProgram'
import {link} from '../util'

export const snake: IProgram = {
  commands: {
    '': p => {
      p.output.print(link('https://steiner.website/snake'))
    },
  },
  name: 'snake',
}
