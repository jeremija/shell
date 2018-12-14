function isNotNull<T>(t: T | null): t is T {
  return t !== null
}

export class DOM {
  public elements: Element[]

  constructor(elements: Element | Element[]) {
    const els = (elements instanceof Array ? elements : [elements])
    .filter(el => !!el)

    if (els.length === 0) {
      throw new Error('No elements passed')
    }
    this.elements = els
  }

  select(query: string): DOM {
    const results: Element[]  = this.elements
    .map(el => el.querySelector(query))
    .filter(isNotNull)

    if (results.length === 0) {
      throw new Error('No elements were selected with query: ' + query)
    }

    return new DOM(results)
  }

  element(): Element {
    return this.elements[0]
  }

  selectAll(query: string) {
    const results: Element[] = []
    this.elements.forEach(el => {
      const select = Array.from(el.querySelectorAll(query))
      results.push.apply(results, select)
    })

    if (results.length === 0) {
      throw new Error('No elements were selected with query: ' + query)
    }

    return new DOM(results)
  }

  on<K extends keyof HTMLElementEventMap>(
    type: K,
    callback: (event: HTMLElementEventMap[K]) => any,
  ) {
    this.elements.forEach(el => el.addEventListener(type, callback))
  }

  removeListener<K extends keyof HTMLElementEventMap>(
    type: K,
    callback: (event: HTMLElementEventMap[K]) => any,
  ) {
    this.elements.forEach(el => el.removeEventListener(type, callback))
  }

  value(text?: string): string {
    if (text === undefined) {
      return (this.elements[0] as HTMLInputElement).value
    }
    this.elements.forEach(el => (el as HTMLInputElement).value = text)
    return text
  }

  text(text?: string): string {
    if (text === undefined) {
      return this.elements[0].textContent || ''
    }
    this.elements.forEach(el => el.textContent = text)
    return text
  }
}

export const $ = (elements: Element | Element[]) => new DOM(elements)
