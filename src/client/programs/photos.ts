import {config} from '../config'
import {imgur} from '../services'
import {IProgramDef} from './IProgramDef'
import {IImageResponse} from '../services/Imgur'

const help = `Usage:  photos &lt;view|thumbs|list&gt; [location] [index]
  list           shows a list of available albums
  thumbs         shows album thumbnails
  view           opens album gallery

  Examples:
    show thumbnails from NYC:          photos thumbs nyc
    view full-size photos from NYC:    photos view nyc
    view third photo from NYC:         photos view nyc 3
   \nUse the [LEFT] and [RIGHT] keys to navigate' +
    'or press [ESC] key.
`

const {albums} = config.services.imgur
const albumsByName = albums.reduce((o, album) => {
  o[album.name] = album
  return o
}, {} as {[key: string]: typeof albums[0]})

function getDescription(image: IImageResponse) {
  const title = image.title
  const description = image.description
  if (title && description) {
    return title + ': ' + description
  }
  if (title && !description) {
    return title
  }
  if (!title && description) {
    return description
  }
  return ''
}

async function getAlbumImages(name: string) {
  const albumInfo = albumsByName[name]
  if (!albumInfo) {
    throw new Error(`No albums found with that name!
Type "photos list" to see available albums`)
  }
  return await imgur.getImages(albumInfo.id)
}

export const photos: IProgramDef = {
  commands: {
    list(p) {
      p.output.print('Available albums:')
      p.output.print(' ')
      albums.forEach(album => {
          p.output.print('  ' + album.name)
      })
      p.output.print(' ')
      p.output.print('To show thumbnails type: photos thumbs &lt;album&gt;')
      p.output.print('To view full images type: photos view &lt;album&gt;')
    },
    async thumbs(p, args) {
      const album = await getAlbumImages(args[2])
      p.output.print('Showing thumbnails for: ' + args[2])
      if (album.description) {
        p.output.print('Description: ' + album.description)
      }
      let html = ''
      album.images.forEach(image => {
        const thumb = image.link.replace(/\.jpg$/, 's.jpg')
        const img = document.createElement('img')
        const parent = document.createElement('div')
        img.setAttribute('class', 'gallery')
        img.setAttribute('src', thumb)
        img.setAttribute('data-fullsrc', image.link || '')
        img.setAttribute('data-description', getDescription(image))
        parent.appendChild(img)
        html += parent.innerHTML
      })
      p.output.print(html)
    },
    async view(p, args) {
      // const album = await getAlbumImages(args[2])
      // TODO
      throw new Error('Viewer not yet implemented!')
    },
    '-h': p => p.output.print(help),
    '--help': p => p.output.print(help),
    help: p => p.output.print(help),
  },
  options: {
    name: 'photos',
  },
}
