import {$, DOM} from './$'

describe('$', () => {

  let div: HTMLElement
  let input: HTMLElement
  let $div: DOM
  beforeEach(() => {
    div = document.createElement('div')
    input = document.createElement('input')
    input.setAttribute('type', 'text')
    div.appendChild(input)

    $div = $(div)
  })

  describe('constructor', () => {
    it('throws when no elements passed', () => {
      expect(() => $([])).toThrowError(/No elements/)
    })
  })

  describe('select', () => {
    it('selects sub element(s)', () => {
      $div.select('input[type="text"]')
      expect(() => $div.select('non-existing'))
      .toThrowError(/No elements/)
    })
  })

  describe('selectAll', () => {
    it('selects all sub-elements', () => {
      const input2 = document.createElement('input')
      input2.setAttribute('type', 'text')
      div.appendChild(input2)
      const $result = $div.selectAll('input[type="text"]')
      expect($result.elements.length).toBe(2)

      expect(() => $div.selectAll('non-existing'))
      .toThrowError(/No elements/)
    })
  })

  describe('on', () => {
    it('adds an event listener', async () => {
      let e: Event | null = null
      $div.select('input').on('change', (ev: Event) => {
        e = ev
      })
      input.dispatchEvent(new Event('change'))
      expect(e).toBeTruthy()
      expect((e as any).type).toBe('change')
    })
  })

  describe('removeListener', () => {
    it('removes an event listener', () => {
      let e: Event | null = null
      const $input = $div.select('input')
      const callback = (ev: Event) => e = ev
      $input.on('change', callback)
      $input.removeListener('change', callback)
      input.dispatchEvent(new Event('change'))
      expect(e).toBe(null)
    })
  })

})
