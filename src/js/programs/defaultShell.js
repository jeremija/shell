/**
 * @module  programs/defaultShell
 */
define(['cli/Shell', 'events/events'], function(Shell, events) {

    var exports = new Shell({
        name: '',
        commands: {
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
                    return;
                }

                var programs = this.programs;
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