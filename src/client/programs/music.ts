import {IProgram} from './IProgram'
import {player, soundCloud} from '../services'
import {Process} from '../Process'
import {link} from '../util'

function validateIndex(index: number, array: any[]) {
  if (index >= array.length) {
    throw new Error('Index out of bounds, max is ' + array.length)
  }
}

function drawProgressBar(percent: number) {
  const count = 20
  const current = percent / 100 * count
  let progress = '['
  let first = true
  for (let i = 0; i < count; i++) {
    if (current > i) {
      progress += '='
    } else if (first) {
      progress += '>'
      first = false
    } else {
      progress += ' '
    }
  }
  return progress + ']'
}

const help = 'This program plays my music from my SoundCloud ' +
  '<a href="https://soundcloud.com/jeremija" target="_blank">account</a>' +
`Usage: music &lt;command&gt; [index]

where &lt;command&gt; is one of:
  playlists              lists all playlists
  tracks                 lists all tracks
  status                 prints playback status

  next                   skips to next track
  next &lt;index&gt;           skips to a track defined by index
  open playlist &lt;index&gt;  loads and plays the specific playlist
  open track &lt;index&gt;     loads and plays the specific track
  pause                  pauses the playback
  play                   starts the playback. Note that a track
                         or a playlist needs to be loaded first
  previous               skips to previous track
  profile                opens my SoundCloud profile
  stop                   stops the playback
  seek &lt;percent&gt;         seeks to percent')
`

const open = {
  async playlist(p: Process, index: number) {
    index--
    const playlists = await soundCloud.getPlaylists()
    validateIndex(index, playlists)
    const list = playlists[index]
    p.output.print('Playing playlist: ' + list.title)
    p.output.print('Playing track: ' + list.tracks[0].title)
    player.openPlaylist(list.tracks)
    player.next(0)
    p.output.print('If you are on a mobile device, you might ' +
        'have to type "music play" for this to work')
    p.output.print('Type "music status" to see more info')
  },
  async track(p: Process, index: number) {
    index--
    const tracks = await soundCloud.getTracks()
    validateIndex(index, tracks)
    const track = tracks[index]
    p.output.print('Playing single track: ' + track.title)
    player.openPlaylist([track])
    player.next(0)
    p.output.print('If you are on a mobile device, you might ' +
        'have to type "music play" for this to work')
    p.output.print('Type "music status" to see more info')
  },
}

export const music: IProgram = {
  commands: {
    '': p => p.output.print(help),
    '-h': p => p.output.print(help),
    '--help': p => p.output.print(help),
    help: p => p.output.print(help),
    async playlists(p) {
      const playlists = await soundCloud.getPlaylists()
      p.output.print('Found ' + playlists.length + ' playlists:')
      p.output.print(' ')
      playlists.forEach((list, index) => {
        p.output.print((index + 1) + '. ' + list.title +
          ' (' + list.tracks.length + ' tracks)')
      })
      p.output.print(' ')
      p.output.print('To play, type: music open playlist &lt;number&gt;')
    },
    async tracks(p) {
      const tracks = await soundCloud.getTracks()
      p.output.print('Found ' + tracks.length + ' tracks:')
      p.output.print(' ')
      tracks.forEach((track, index) => {
        p.output.print((index + 1) + '. ' + track.title)
      })
      p.output.print(' ')
      p.output.print('To play, type: music open track &lt;number&gt;')
    },
    async open(p, args) {
      const len = args.length
      if (len !== 4) {
        throw new Error('Expected four arguments, got ' + len)
      }
      const [what, index] = args.slice(2)
      if (what !== 'track' && what !== 'playlist') {
          exports.error('first argument should be either \'track\'' +
              ' or \'playlist\'')
          return
      }
      const i = parseInt(index, 10)
      if (isNaN(i) || i < 1) {
          throw new Error('Invalid index, should start from 1')
      }
      open[what](p, i)
    },
    play() {
        if (!player.getStatus().total) {
            exports.error('Cannot play, no playlist set.')
            return
        }
        player.play()
        return
    },
    pause: () => player.pause(),
    stop: () => player.stop(),
    next(p, args) {
      if (args.length) {
        const index = parseInt(args[0], 10) - 1
        if (isNaN(index)) {
          p.output.print('Invalid parameter, expected an integer')
          return
        }
        player.next(index)
      } else {
        player.next()
      }

      const status = player.getStatus()
      if (status.title) {
        p.output.print('Playing ' + player.getStatus().title)
      } else {
        p.output.print('No next track')
      }
    },
    previous(p) {
      player.previous()
      const status = player.getStatus()
      if (status.title) {
        p.output.print('Playing ' + player.getStatus().title)
      } else {
        p.output.print('No previous track')
      }
    },
    seek(p, args) {
      if (!args.length) {
        throw new Error('Expecte seek percent argument')
      }
      const percent = parseInt(args[0], 10)
      if (isNaN(percent) || percent < 0 || percent > 100) {
        throw new Error('Seek argument should be between 0 and 100')
      }
      player.seek(percent)
    },
    status(p) {
        const status = player.getStatus()
        p.output.print('Playback status: ' + status.status)
        p.output.print('Current track: ' +
            (status.title ? status.current + '. ' + status.title :
                '&lt;not set&gt;'))
        if (!isNaN(status.percent)) {
            p.output.print(drawProgressBar(status.percent))
        }
        if (status.total) {
          p.output.print(' ')
          status.playlist.forEach((track, index) => {
            const prefix = status.index === index ? ' =&gt; ' : '    '
            const text = prefix + (index + 1) + '. ' + track.title
            p.output.print(text)
          })
          p.output.print(' ')
          p.output.print('Total ' + status.total + ' tracks')
        } else {
          p.output.print('No playlist set')
        }
    },
    profile(p) {
      p.output.print(link('https://soundcloud.com/jeremija'))
    },
  },
  name: 'music',
  options: {
    prefix: 'music$',
  },
}
