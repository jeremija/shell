import {Http} from './Http'

export class SoundCloud {
  protected readonly http: Http

  constructor(
    protected readonly clientId: string,
    protected readonly apiUrl: string,
  ) {
    this.http = new Http(apiUrl, {
      Authorization: clientId,
    })
  }

  async getImages(albumId: string): Promise<IImageResponse> {
    return this.http.get('/3/album/' + albumId)
  }
}

export interface IImageResponse {
  images: Array<{
    title?: string,
    description?: string,
    link: string,
  }>
}
