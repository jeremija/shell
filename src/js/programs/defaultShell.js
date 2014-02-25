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
                var programs = this.programs.join('   ');
                this.output(programs);
            },
        }
    });

    return exports;

});