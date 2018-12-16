import {IProgram} from './IProgram'
import {ICommands} from '../ICommands'
import {Process} from '../Process'

export interface IImage {
  link: string
  title?: string
  description?: string
}

export const createThumbnails = (mountPoint: HTMLElement) => {
  return class ThumbnailsClass implements IProgram {
    readonly name = 'thumbnails'
    readonly commands: ICommands

    protected element?: HTMLDivElement

    constructor() {
      this.commands = {
        open: this.open,
      }
    }

    open(p: Process, args: string[]) {
      const [json] = args.slice(2)
      const images: IImage[] = JSON.parse(json)
      this.mount(images)
    }

    mount(images: IImage[]) {
      const ui = this.element = document.createElement('div')
      ui.className = 'ui-program'
      const close = document.createElement('a')
      close.className = 'close'
      close.href = '#'
      close.textContent = '[close]'
      close.onclick = () => this.unmount()
      ui.appendChild(close)
      mountPoint.appendChild(ui)

      const thumbnails = document.createElement('div')
      ui.appendChild(thumbnails)

      thumbnails.className = 'thumbnails'
      images.forEach(i => {
        const img = document.createElement('img')
        img.setAttribute('class', 'gallery')
        img.setAttribute('src', i.link.replace(/\.jpg$/, 's.jpg'))
        img.setAttribute('data-fullsrc', i.link || '')
        img.setAttribute('data-description', i.description!)
        img.setAttribute('data-title', i.title!)
        img.setAttribute('data-index', i.toString())
        // img.onclick = handleImageClick
        thumbnails.appendChild(img)
      })

    }

    unmount() {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element)
      }
    }
  }
}

export const Thumbnails = createThumbnails(document.getElementById('ui')!)
