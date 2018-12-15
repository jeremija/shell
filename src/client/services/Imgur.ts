import {Http} from './Http'

export class Imgur {
  protected readonly http: Http

  constructor(
    protected readonly clientId: string,
    protected readonly apiUrl: string,
  ) {
    this.http = new Http(apiUrl, {
      Authorization: clientId,
    })
  }

  async getImages(albumId: string): Promise<IAlbumResponse> {
    return this.http.get('/album/' + albumId)
    .then(response => response.data)
  }
}

export interface IAlbumResponse {
  description?: string
  images: IImageResponse[]
}

export interface IImageResponse {
  title?: string,
  description?: string,
  link: string,
}
