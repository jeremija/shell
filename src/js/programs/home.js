define(['cli/Program', 'events/events'], function(Program, events) {
    var exports = new Program({
        name: 'home',
        defaultAction: function() {
            events.dispatch('link', 'http://steiner.website/');
        }
    });
    return exports;
});