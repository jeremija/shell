/**
 * @module  programs/defaultShell
 */
define(['cli/Shell', 'events/events'], function(Shell, events) {

    var exports = new Shell({
        name: '',
        default: function() {
            this.output(new Date());
            this.output(' ');
            this.output('Hello, stranger!');
            this.output(' ');
            this.output('This is a unix-like shell I made to showcase my programming skills.');
            this.output('Here you can find information about my background, skills, work experience and more.');
            this.output(' ');
            this.output('Type "help" and press enter to get started. Follow the instructions along the way.');
            this.output(' ');
            this.output('Enjoy your stay!');
            this.output('    Jerko Steiner');
            this.output(' ');
        },
        commands: {
            'intro': function() {
                this.default();
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