import {DOM} from './$'
import {scrollToBottom} from './util'

export interface IOutput {
  append(p: HTMLElement): void
  print(...text: string[]): void
  error(...text: string[]): void
  clear(): void
}

export class Output implements IOutput {
  protected element: Element
  constructor(
    protected readonly $element: DOM,
  ) {
    this.element = $element.element()
  }

  append(p: HTMLElement) {
    this.element.appendChild(p)
  }

  print = (...text: string[]) => {
    const p = this.createTextElement(text.join(' '))
    this.append(p)
    scrollToBottom()
  }

  error = (...text: string[]) => {
    const p = this.createTextElement(text.join(' '), 'error')
    this.append(p)
    scrollToBottom()
  }

  clear = () => {
    this.element.innerHTML = ''
  }

  protected createTextElement(text: string, className = '')
    : HTMLParagraphElement {
      const p = document.createElement('p')
      p.innerHTML = text
      p.className = className
      return p
  }
}
