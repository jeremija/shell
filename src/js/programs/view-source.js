define(['cli/Program', 'events/events'], function(Program, events) {

    var exports = new Program({
        name: 'view-source',
        default: function(args) {
            if (args) {
                return;
            }
            events.dispatch('link', 'http://github.com/jeremija/shell');
        },
        args: {
            '--help': function() {
                this.output('view-source: opens the project page on github');
            }
        }
    });

    return exports;

});