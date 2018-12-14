import {EventEmitter} from 'events'

class EventEmitter2 extends EventEmitter {
  emit(event: string | symbol, ...args: any[]): boolean {
    super.emit('*', event, ...args)
    return super.emit(event, ...args)
  }
}

export const events = new EventEmitter2()
