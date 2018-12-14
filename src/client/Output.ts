import {DOM} from './$'

export class Output {
  protected element: Element
  constructor(
    protected readonly $element: DOM,
  ) {
    this.element = $element.element()
  }

  protected append(p: HTMLElement) {
    this.element.appendChild(p)
  }

  print = (...text: string[]) => {
    const p = this.createTextElement(text.join(' '))
    this.append(p)
    this.scrollToBottom()
  }

  error = (...text: string[]) => {
    const p = this.createTextElement(text.join(' '), 'error')
    this.append(p)
    this.scrollToBottom()
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

  protected scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight)
  }
}
