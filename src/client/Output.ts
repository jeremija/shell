import * as c from './constants'
import {DOM} from './$'
import {EventEmitter} from 'events'

export class Output {
  protected element: Element
  constructor(
    protected readonly $element: DOM,
    protected readonly events: EventEmitter,
  ) {
    this.element = $element.element()
    events.on(c.EVENT_STDOUT, this.handleStdOut)
    events.on(c.EVENT_STDERR, this.handleStdErr)
    events.on(c.EVENT_CLEAR, this.handleClear)
  }

  handleStdOut = (text: string) => {
    const p = this.createTextElement(text)
    this.element.appendChild(p)
    this.scrollToBottom()
  }

  handleStdErr = (text: string) => {
    const p = this.createTextElement(text, 'error')
    this.element.appendChild(p)
    this.scrollToBottom()
  }

  handleClear = () => {
    this.element.innerHTML = ''
  }

  protected createTextElement(text: string, className = '') {
      const p = document.createElement('p')
      p.innerHTML = text
      p.className = className
      return p
  }

  protected scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight)
  }
}
