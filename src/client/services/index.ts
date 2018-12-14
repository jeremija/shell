import {config} from '../config'
import {SoundCloud} from './SoundCloud'
import {Player} from './Player'

export const soundCloud = new SoundCloud(
  config.services.soundcloud.clientId,
  config.services.soundcloud.apiUrl,
  config.services.soundcloud.userId,
)

export const player = new Player(soundCloud)
