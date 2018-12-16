import {createThumbnails, IImage} from './Thumbnails'

describe('Thumbnails', () => {

  let mountPoint: HTMLElement | undefined
  type ThumbnailsClass = ReturnType<typeof createThumbnails>
  let t: InstanceType<ThumbnailsClass>
  beforeEach(() => {
    mountPoint = document.createElement('div')
    const Thumbnails: ThumbnailsClass = createThumbnails(mountPoint)
    t = new Thumbnails()
  })

  const images: IImage[] = [{
    link: 'https://test/',
    title: 'test',
    description: 'test',
  }]

  describe('open', () => {
    beforeEach(() => {
      t.open({} as any, ['thumbnails', 'open', JSON.stringify(images)])
    })
    it('attaches images to mount point', () => {
      t.open({} as any, ['thumbnails', 'open', JSON.stringify(images)])
      const image = mountPoint!.querySelector('img')!
      expect(image).toBeTruthy()
      expect(image.src).toEqual(images[0].link)
    })

    it('can be closed', () => {
      mountPoint!.querySelector('.close')!.dispatchEvent(new Event('click'))
      const image = mountPoint!.querySelector('img')
      expect(image).toBeNull()
    })
  })
})
