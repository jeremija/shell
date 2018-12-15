import {IProgram} from './IProgram'

export const invert: IProgram = {
  commands: {
    '': () => {
      document.body.classList.toggle('white')
    },
  },
  name: 'invert',
}
