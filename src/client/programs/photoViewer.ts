import {Program} from '../Program'
import {IProgramDef} from './IProgramDef'
import {IAlbumResponse, IImageResponse} from '../services/Imgur'
import {scrollToBottom} from '../util'

function showImage(p: Program, image: IImageResponse) {
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

function next(p: Program, args: string[]) {
  const album = p.memory.album as IAlbumResponse
  if (p.memory.index >= album.images.length - 1) {
    throw new Error('No more images')
  }
  const index = ++p.memory.index
  const image = album.images[index]
  showImage(p, image)
}

export const photoViewer: IProgramDef = {
  commands: {
    open: (p, args) => {
      const [json, indexString] = args.slice(2)
      const album = JSON.parse(json) as IAlbumResponse
      const index = parseInt(indexString, 10) || 0
      const image = album.images[index]
      p.memory.index = index
      p.memory.album = album
      showImage(p, image)
    },
    n: next,
    '': next,
    p: (p, args) => {
      const album = p.memory.album as IAlbumResponse
      if (p.memory.index ===  0) {
        throw new Error('No more images')
      }
      const index = --p.memory.index
      const image = album.images[index]
      showImage(p, image)
    },
    e: p => p.exit(),
    exit: p => p.exit(),
  },
  options: {
    name: 'photo-viewer',
    autoExit: false,
    prefix: 'photo-viewer$',
  },
}
