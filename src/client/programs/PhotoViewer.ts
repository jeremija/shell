import {IAlbumResponse, IImageResponse} from '../services/Imgur'
import {ICommands} from '../ICommands'
import {IProcessOptions, Process} from '../Process'
import {IProgram} from './IProgram'
import {scrollToBottom} from '../util'

function showImage(p: Process, image: IImageResponse) {
  const img = document.createElement('img')
  img.src = image.link
  img.style.maxWidth = '100%'
  img.style.maxHeight = '100vh'
  img.onload = scrollToBottom
  p.output.append(img)
  p.output.print('The following commands are available: ' +
    '[p]revious, [n]ext, [e]xit')
}

export class PhotoViewer implements IProgram {
  readonly name = 'photo-viewer'
  readonly commands: ICommands
  readonly options: Partial<IProcessOptions>

  private album: IAlbumResponse | undefined
  private index = 0

  constructor() {
    this.options = {
      autoExit: false,
      prefix: 'photo-viewer$',
    }

    this.commands = {
      open: this.open,
      n: this.next,
      '': this.next,
      p: this.previous,
      e: this.exit,
      exit: this.exit,
    }
  }

  exit(p: Process) {
    p.exit()
  }

  open(p: Process, args: string[]) {
    const [json, indexString] = args.slice(2)
    this.album = JSON.parse(json) as IAlbumResponse
    this.index = parseInt(indexString, 10) || 0
    const image = this.album.images[this.index]
    showImage(p, image)
  }

  next(p: Process) {
    const {album} = this
    let {index} = this
    if (index >= album!.images.length - 1) {
      throw new Error('No more images')
    }
    index = ++this.index
    const image = album!.images[index]
    showImage(p, image)
  }

  previous(p: Process) {
    if (this.index ===  0) {
      throw new Error('No more images')
    }
    const index = --this.index
    const image = this.album!.images[index]
    showImage(p, image)
  }

}
