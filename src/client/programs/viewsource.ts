import {IProgramDef} from './IProgramDef'
import {link} from '../util'

export const viewsource: IProgramDef = {
  commands: {
    '': p => p.output.print(link('https://github.com/jeremija/shell')),
  },
  options: {
    name: 'viewsource',
  },
}
