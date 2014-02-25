/**
 * Handlers all user input
 * @module cli/tasks
 */
define(['events/events'], function(events) {

    var exports = {
        stack: undefined,
        shell: undefined,
        /**
         * @param  {Object} params
         * @param  {cli/Shell} params.shell
         */
        init: function(params) {
            this.shell = params.shell;
            this.stack = [];

            events.dispatch('active-program', this.shell.name);

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

            events.dispatch('active-program', program.name);
            program.init.apply(program, args);
        },
        _onExit: function() {
            // remove last program from stack
            this.stack.pop();

            var program = this.getActiveProgram();
            events.dispatch('active-program', program.name);
        },
        _onInput: function(text, autocomplete) {
            var program = this.getActiveProgram();
            if (autocomplete) {
                var suggestions = program.autocomplete(text);
                events.dispatch('autocomplete', suggestions);
                return;
            }
            program.input(text);
        },
    };

    return exports;

});