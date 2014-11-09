define(['cli/Program', 'events/events'], function(Program, events) {

    var exports = new Program({
        name: 'player',
        defaultAction: function(args) {
            if (args) return;
            var url = 'https://api.soundcloud.com/tracks/173656864/stream?client_id=002eaf35d4b2ca43b25742d0b839d1f0';
            var audio = new Audio(url);
            audio.play();
        },
        args: {
            'previous': function() {

            },
            'play': function() {

            },
            'pause': function() {

            },
            'next': function() {

            },
            'stop': function() {

            }
        }
    });

    return exports;

});