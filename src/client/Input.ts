import {DOM} from './$'
import {EventEmitter} from './EventEmitter'
import {History} from './history'

import * as c from './constants'

// const BACKSPACE_KEY = 8
export const ENTER_KEY = 13
export const TAB_KEY = 9
export const UP_KEY = 38
export const DOWN_KEY = 40

export class Input extends EventEmitter {
  protected history = new History()

  protected readonly $prefix: DOM
  protected readonly $input: DOM
  protected readonly $form: DOM

  constructor(protected readonly $console: DOM) {
    super()
    this.$prefix = $console.select('#input-prefix')
    this.$form = $console.select('#input-form')
    this.$input = $console.select('#input')

    this.$input.on('keydown', this.handleKeyDown)
    this.$form.on('submit', this.handleSubmit)
  }

  setValue(value: string) {
    this.$input.value(value)
  }

  setPrefix(value: string) {
    this.$prefix.text(value)
  }

  getValue() {
    return this.$input.value()
  }

  protected handleSubmit = (event: Event) => {
    event.preventDefault()
    const value = this.$input.value()
    this.$input.value('')
    this.emit(c.EVENT_INPUT_ENTER, value)
    this.history.add(value)
  }

  protected handleKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case TAB_KEY:
        event.preventDefault()
        this.handleTab()
        break
      case UP_KEY:
        event.preventDefault()
        this.handleUp()
        break
      case DOWN_KEY:
        event.preventDefault()
        this.handleDown()
        break
    }
  }

  protected handleTab() {
    this.emit(c.EVENT_INPUT_TAB, this.$input.value())
  }
  protected handleUp() {
    const value = this.history.previous()
    this.$input.value(value)
  }
  protected handleDown() {
    const value = this.history.next()
    this.$input.value(value)
  }
}
