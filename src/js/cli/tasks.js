/**
 * Handlers all user input
 * @module cli/tasks
 */
define(['events/events'], function(events) {

    var exports = {
        stack: undefined,
        shell: undefined,
        init: function(params) {
            this.shell = params.shell;
            this.stack = [];

            events.dispatch('output-prefix', this.shell.name);

            events.listen('input', this._onInput, this);
            events.listen('init', this._onInit, this);
            events.listen('exit', this._onExit, this);
        },
        getActiveProgram: function() {
            return this.stack[this.stack.length - 1] || this.shell;
        },
        _onInit: function(program, args) {
            // add new program to stack
            this.stack.push(program);

            events.dispatch('output-prefix', program.name);
            program.init.apply(program, args);
        },
        _onExit: function() {
            // remove last program from stack
            this.stack.pop();

            var program = this.getActiveProgram();
            events.dispatch('output-prefix', program.name);
        },
        _onInput: function(text) {
            var program = this.getActiveProgram();
            program.input(text);
        },
    };

    return exports;

});