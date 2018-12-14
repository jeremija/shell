import {Http} from './Http'

export class SoundCloud {
  protected readonly playlistsUrl: string
  protected readonly tracksUrl: string
  protected readonly http: Http

  constructor(
    protected readonly clientId: string,
    protected readonly apiUrl: string,
    protected readonly userId: string,
  ) {
    this.http = new Http(apiUrl)
    this.playlistsUrl = `/users/${userId}/playlists.json`
    this.tracksUrl = `/users/${userId}/tracks.json`
  }

  buildUrl(url: string) {
    return url + '?client_id=' + this.clientId
  }

  async getPlaylists(): Promise<IPlaylistResponse[]> {
    const { clientId } = this
    return this.http.get(this.playlistsUrl, { clientId })
  }

  async getTracks(): Promise<ITrackResponse[]> {
    const { clientId } = this
    return this.http.get(this.tracksUrl, { clientId })
  }
}

export interface IPlaylistResponse {
  title: string
  tracks: ITrackResponse[]
}

export interface ITrackResponse {
  stream_url: string
  title: string
}
