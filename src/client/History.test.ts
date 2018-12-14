import {History} from './History'

describe('History', () => {

  let history: History
  beforeEach(() => {
    history = new History()
  })

  describe('previous and next', () => {
    it('goes back and forward', () => {
      history.add('a')
      history.add('b')
      history.add('c')
      expect(history.previous()).toEqual('c')
      expect(history.previous()).toEqual('b')
      expect(history.previous()).toEqual('a')
      expect(history.previous()).toEqual('')
      expect(history.previous()).toEqual('')
      expect(history.next()).toEqual('a')
      expect(history.next()).toEqual('b')
      expect(history.next()).toEqual('c')
      expect(history.previous()).toEqual('b')
      // expect(history.previous()).toEqual('a')
    })
  })
})
