/**
 * @module  programs/defaultShell
 */
define(['cli/Shell', 'events/events'], function(Shell, events) {

    var ONE_DAY = 1000 * 60 * 60 * 24;

    function getLastVisit() {
        var lastVisit = localStorage ? localStorage.getItem('date') : undefined;
        if (localStorage) localStorage.setItem('date', Date.now());
        if (!lastVisit) return 'This is your first visit.';
        var diff = (Date.now() - parseInt(lastVisit));
        if (diff < 0) return 'Wow, you travelled through time!';
        if (diff < 1000 * 60 * 15) {
            return 'Your last visit was a few minutes ago.';
        }
        var days = diff / ONE_DAY;
        if (days < 1) return 'Your last visit was within the last 24 hours.';
        days = Math.round(days);
        var daysString = days < 2 ? 'day' : 'days';
        return 'Your last visit was ' + days + ' ' + daysString + ' ago.';
    }

    var exports = new Shell({
        name: '',
        defaultAction: function() {
            this.output(new Date());
            this.output(getLastVisit());
            this.output(' ');
            this.output('Hello, stranger!');
            this.output(' ');
            this.output('This is a unix-like shell I made to showcase my programming skills.');
            this.output('Here you can find information about my background, skills, work experience and more.');
            this.output(' ');
            this.output('You can also view some of the photos I took and listen to my music.');
            this.output(' ');
            this.output('Type "help" and press enter to get started. Follow the instructions along the way.');
            this.output(' ');
            this.output('Enjoy your stay!');
            this.output('    Jerko Steiner');
            this.output(' ');
        },
        commands: {
            'intro': function() {
                this.defaultAction();
            },
            'clear': function(arg) {
                if (arg === '--help') {
                    this.output('clear: clears the console output');
                    return;
                }
                events.dispatch('output-clear');
            },
            'ls': function(arg) {
                if (arg === '--help') {
                    this.output('ls: lists registered programs');
                    this.output('  -l   shows programs in a list');
                    return;
                }

                var programs = this.programs;
                programs.sort();
                if (arg === '-l') {
                    for (var i in programs) {
                        var program = programs[i];
                        this.output(program);
                    }
                    return;
                }

                this.output(programs.join('   '));
            },
        }
    });

    return exports;

});