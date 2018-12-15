import {IAlbumResponse, IImageResponse} from '../services/Imgur'
import {ICommands} from '../ICommands'
import {IProgram} from './IProgram'
import {IProcessOptions, Process} from '../Process'
import {scrollToBottom} from '../util'

function showImage(p: Process, image: IImageResponse) {
  const parent = document.createElement('parent')
  const img = document.createElement('img')
  img.src = image.link
  img.style.maxWidth = '100%'
  img.style.maxHeight = '100vh'
  img.onload = scrollToBottom
  parent.appendChild(img)
  p.output.print(parent.innerHTML)
  p.output.print('The following commands are available: ' +
    '[p]revious, [n]ext, [e]xit')
}

export class PhotoViewer implements IProgram {
  readonly name = 'photo-viewer'
  readonly commands: ICommands
  readonly options: Partial<IProcessOptions>

  constructor() {
    this.options = {
      autoExit: false,
      prefix: 'photo-viewer$',
    }

    let index = 0
    let album: IAlbumResponse | undefined

    function next(p: Process, args: string[]) {
      if (index >= album!.images.length - 1) {
        throw new Error('No more images')
      }
      ++index
      const image = album!.images[index]
      showImage(p, image)
    }

    this.commands = {
      open: (p, args) => {
        const [json, indexString] = args.slice(2)
        album = JSON.parse(json) as IAlbumResponse
        index = parseInt(indexString, 10) || 0
        const image = album.images[index]
        showImage(p, image)
      },
      n: next,
      '': next,
      p: (p, args) => {
        if (index ===  0) {
          throw new Error('No more images')
        }
        --index
        const image = album!.images[index]
        showImage(p, image)
      },
      e: p => p.exit(),
      exit: p => p.exit(),
    }
  }

}
