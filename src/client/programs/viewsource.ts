import {IProgram} from './IProgram'
import {link} from '../util'

export const viewsource: IProgram = {
  commands: {
    '': p => p.output.print(link('https://github.com/jeremija/shell')),
  },
  name: 'view-source',
}
