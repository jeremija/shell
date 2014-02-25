define(['cli/Program', 'events/events'], function(Program, events) {

    /**
     * @class Defines a cli shell
     * @name cli/Shell
     * @param {[type]} params [description]
     */
    function Shell(params) {
        // call super constructor
        this.superclass(params);
    }

    var ShellPrototype = {
        registerProgram: function(program) {
            if (program instanceof Program === false) {
                this.error('invalid program instance');
                return;
            }

            if (program.name in this.commands) {
                this.error('program ' + program.name + ' + already registered');
                return;
            }

            // add a program name as a command
            this.commands[program.name] = function(/* variable args */) {
                // forward the command's arguments to the program
                events.dispatch('init', program, arguments);
            };
        }
    };

    return Program.extend(Shell, ShellPrototype);

});