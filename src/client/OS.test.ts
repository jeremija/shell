import * as c from './constants'
import {EventEmitter} from './EventEmitter'
import {IInput} from './Input'
import {IOutput} from './Output'
import {OS} from './OS'

describe('OS', () => {

  class InputMock extends EventEmitter implements IInput {
    setValue = jest.fn()
    getValue = jest.fn().mockReturnValue('')
    setPrefix = jest.fn()
  }

  class OutputMock implements IOutput {
    public readonly out: string[] = []
    public readonly err: string[] = []
    append(p: HTMLElement) {
      const parent = document.createElement('div')
      parent.appendChild(p)
      this.out.push(parent.innerHTML)
    }
    print(...p: string[]) {
      this.out.push.apply(this.out, p)
    }
    error(...p: string[]) {
      this.err.push.apply(this.err, p)
    }
    clear() {
      this.out.length = 0
      this.err.length = 0
    }
  }

  let input: InputMock
  let output: OutputMock
  // @ts-ignore
  let os: OS
  beforeEach(() => {
    input = new InputMock()
    output = new OutputMock()
    os = new OS(input, output)
  })

  describe('startup', () => {
    it('creates a shell', () => {
      input.emit(c.EVENT_INPUT_TAB, '')
      expect(output.out).toEqual([
        '$ ',
        jasmine.stringMatching(/ls/),
      ])
    })
  })

})
