// import {config} from './config'
import {EventEmitter} from './EventEmitter'
import {Input} from './Input'
import {Output} from './Output'
import {OS} from './OS'
import {$} from './$'

const events = new EventEmitter()

const $body = $(document.body)
const $input = $body.select('#console-input')
const $output = $body.select('#console-output')

events.on('*', window.console.log.bind(console))

export const input = new Input($input)
export const output = new Output($output)
export const os = new OS(input, output)
