define(['cli/Program', 'events/events'], function(Program, events) {

    var exports = new Program({
        name: 'snake',
        default: function() {
            events.dispatch('link', 'http://steinerize.com/snake');
        }
    });

    return exports;

});