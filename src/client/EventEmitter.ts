import {EventEmitter as EE} from 'events'

export class EventEmitter extends EE {
  emit(event: string | symbol, ...args: any[]): boolean {
    super.emit('*', event, ...args)
    return super.emit(event, ...args)
  }
}
