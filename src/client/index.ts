// import {config} from './config'
import {events} from './events'
import {Input} from './Input'
import {Output} from './Output'
import {$} from './$'

const $body = $(document.body)
const $input = $body.select('#console-input')
const $output = $body.select('#console-output')

events.on('*', window.console.log.bind(console))

export const input = new Input($input, events)
export const output = new Output($output, events)
