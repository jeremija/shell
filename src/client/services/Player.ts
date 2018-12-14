import {$, DOM} from '../$'
import {SoundCloud, ITrackResponse} from './SoundCloud'

export class Player {
  protected playlist: ITrackResponse[] = []
  protected index = 0
  protected audio = new Audio()
  protected $audio: DOM = $(this.audio)

  constructor(protected readonly soundCloud: SoundCloud) {}

  protected createAudio(url: string) {
    const {audio, $audio} = this
    if (this.audio) {
      audio.pause()
      $audio.removeListener('ended', this.handleEnd)
    }

    this.audio = new Audio(this.soundCloud.buildUrl(url))
    this.$audio = $(this.audio)
    this.$audio.on('ended', this.handleEnd)
  }

  handleEnd = () => {
    this.next()
  }

  openPlaylist(playlist: ITrackResponse[]) {
    this.playlist = playlist
    this.index = 0
  }

  getStatus() {
    const {audio, index, playlist} = this
    const track = playlist[index]
    const duration = audio ? audio.duration : 0
    const currentTime = audio ? audio.currentTime : 0

    return {
        current: index + 1,
        index,
        total: playlist.length,
        playlist,
        percent: Math.round((currentTime / duration * 100)),
        title: track && track.title,
        status: audio ? (audio.paused ? 'idle' : 'playing') : 'idle',
    }
  }

  previous() {
    let i = --this.index
    if (i < 0) {
      i = 0
    }
    const track = this.playlist[i]
    if (!track) {
      return
    }
    this.createAudio(track.stream_url)
    this.play()
  }
  play() {
    this.audio.play()
  }
  pause() {
    const {audio} = this
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }
  next(i?: number) {
    const {playlist} = this
    if (i === undefined) {
      i = ++this.index
    }
    if (i >= playlist.length) {
        this.index = 0
    }
    const track = playlist[i]
    this.index = i
    this.createAudio(track.stream_url)
    this.play()
  }
  stop() {
    const {audio} = this
    audio.pause()
    audio.currentTime = 0
  }
  seek(percent: number) {
    const {audio} = this
    const seekTime = audio.duration * percent / 100
    audio.currentTime = seekTime
  }
}
