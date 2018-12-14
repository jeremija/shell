define(['cli/Program', 'events/events'], function(Program, events) {

    var exports = new Program({
        name: 'snake',
        defaultAction: function() {
            events.dispatch('link', 'http://steiner.website/snake');
        }
    });

    return exports;

});
