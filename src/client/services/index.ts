import {config} from '../config'
import {SoundCloud} from './SoundCloud'
import {Player} from './Player'
import {Imgur} from './Imgur'

export const soundCloud = new SoundCloud(
  config.services.soundcloud.clientId,
  config.services.soundcloud.apiUrl,
  config.services.soundcloud.userId,
)

export const player = new Player(soundCloud)

export const imgur = new Imgur(
  config.services.imgur.clientId,
  config.services.imgur.apiUrl,
)
