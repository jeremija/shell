import {DOM} from './$'
import {EventEmitter} from 'events'
import {History} from './history'

import * as c from './constants'

// const BACKSPACE_KEY = 8
export const ENTER_KEY = 13
export const TAB_KEY = 9
export const UP_KEY = 38
export const DOWN_KEY = 40

export class Input {
  protected history = new History()

  protected readonly $prefix: DOM
  protected readonly $input: DOM
  protected readonly $form: DOM

  constructor(
    protected readonly $console: DOM,
    protected readonly events: EventEmitter,
  ) {
    this.$prefix = $console.select('#input-prefix')
    this.$form = $console.select('#input-form')
    this.$input = $console.select('#input')

    this.$input.on('keydown', this.handleKeyDown)
    this.$form.on('submit', this.handleSubmit)

    this.events.on(c.EVENT_AUTOCOMPLETE_RESPONSE, this.handleAutocomplete)
  }

  handleAutocomplete(suggestions: string[]) {
    if (!suggestions.length) {
      return
    }
    if (suggestions.length === 1) {
      this.$input.value(suggestions[0])
      return
    }
    this.events.emit(c.EVENT_STDOUT, suggestions.join('    '))
  }

  handleSubmit = (event: Event) => {
    event.preventDefault()
    const value = this.$input.value()
    this.events.emit(c.EVENT_SUBMIT, value)
    this.history.add(value)
    this.$input.value('')
  }

  handleKeyDown = (event: KeyboardEvent) => {
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
    this.events.emit(c.EVENT_AUTOCOMPLETE_REQUEST, this.$input.value())
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
