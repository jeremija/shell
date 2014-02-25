define(['cli/Program', 'events/events'], function(Program, events) {

    /**
     * @class Defines a cli shell
     * @name cli/Shell
     * @param {[type]} params [description]
     */
    function Shell(params) {
        // call super constructor
        this.superclass(params);

        this.programs = [];
    }

    var ShellPrototype = {
        registerProgram: function(program) {
            if (!this.commands) {
                this.commands = {};
            }
            if (program.name in this.commands) {
                this.error('program ' + program.name + ' + already registered');
                return;
            }

            this.programs.push(program.name);

            // add a program name as a command
            this.commands[program.name] = function(/* variable args */) {
                // forward the command's arguments to the program
                events.dispatch('init', program, arguments);
            };
        }
    };

    return Program.extend(Shell, ShellPrototype);

});