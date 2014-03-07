define(['cli/Program', 'events/events'], function(Program, events) {

    var exports = new Program({
        name: 'snake',
        defaultAction: function() {
            events.dispatch('link', 'http://steinerize.com/snake');
        }
    });

    return exports;

});