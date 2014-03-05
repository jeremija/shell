define(['Extendable', 'events/events'], function(Extendable, events) {

    /**
     * @typedef {module:cli/Program~command}
     * @property {String} name
     * @property {Function} callback
     */

    /**
     * @typedef {module:cli/Program~args}
     * @property {String} name
     * @property {Function} callback
     */

    /**
     * @class Defines a CLI program
     * @name cli/Program
     * @param {Object} params
     * @param {String} params.name
     * @param {Function} params.default           default function which will
     * be executed upon program initialization
     * @param {Array.<command>} params.commands
     * @param {Array.<args>} params.args
     */
    function Program(params) {
        this.name = params.name;
        this.default = params.default;
        this.commands = params.commands;
        this.args = params.args;

        this.data = {};
        this.questions = [];
    }

    var ProgramPrototype = {
        _getArgsFromText: function(text) {
            // merge multiple spaces into one
            text = text.replace(/' {2,}/, ' ');
            // filter commands by spaces
            var args = text.split(' ');
            return args;
        },
        _callArgCallback: function(args, index) {
            var arg = args[index];

            var callback;
            for (var argName in this.args) {
                if (arg === argName) {
                    callback = this.args[argName];
                    break;
                }
            }
            if (!callback) {
                this.error('invalid argument ' + arg);
                return;
            }
            // number of expected arguments for function
            var length = callback.length;
            // get arguments for function
            var params = length === 0 ? [] : args.splice(index + 1, length);
            callback.apply(this, params);
        },
        _getNextQuestion: function() {
            if (this.questions.length > 0) {
                return this.questions[0];
            }
        },
        /**
         * Initializes the program.
         * @param  {String...} arguments       with which the program was
         * started. The first part of the string should be the executable
         * itself.
         */
        init: function(/* variable arguments */) {
            this.data = {};
            this.questions = [];

            if (this.default) {
                this.default.apply(this, arguments);
            }

            // var args = this._getArgsFromText(text);
            var args = [].slice.call(arguments);

            for (var i = 0; i < args.length; i++) {
                this._callArgCallback(args, i);
            }

            if (!this.commands && this.questions.length === 0) {
                this.exit();
            }
        },
        /**
         * @fires {module:events/events#exit)
         */
        exit: function() {
            events.dispatch('exit');
        },
        _autocompleteAnswer: function(question, regexp) {
            var suggestions = [];
            var answers = question.answers;
            for(var i in answers) {
                var answer = answers[i];
                if (answer.match(regexp)) {
                    suggestions.push(answer);
                }
            }
            suggestions.sort();
            return suggestions;
        },
        _autocompleteCommand: function(regexp) {
            var suggestions = [];
            var commands = this.commands;
            if (!commands) {
                return suggestions;
            }
            for(var commandName in commands) {
                if (commandName.match(regexp)) {
                    suggestions.push(commandName);
                }
            }
            suggestions.sort();
            return suggestions;
        },
        /**
         * Find an array of commands which begin with a specific string.
         * @param  {String} part      first part of command
         * @return {Array.<String>}   array of possible commands to execute
         */
        autocomplete: function(part) {
            var suggestions = [];
            var regexp = new RegExp('^' + part);

            var question = this._getNextQuestion();
            if (question) {
                return this._autocompleteAnswer(question, regexp);
            }

            return this._autocompleteCommand(regexp);
        },
        /**
         * Executes the users command. If command is exit, the exit method is
         * called. If there are questions in the questions array, the
         * input will be undrestood as an answer to an asked question.
         * Otherwise, an attempt will be made to call a command.
         * @param {String} text [description]
         */
        input: function(text) {
            if (text === 'exit') {
                this.exit();
                return;
            }
            if (this.questions.length > 0) {
                this._answerQuestion(text);
                return;
            }
            this._callCommand(text);
        },
        /**
         * Output message
         * @param {String} message
         * @fires {module:events/events#output}
         */
        output: function(message) {
            events.dispatch('output', message);
        },
        /**
         * Output error message
         * @param {String} message
         * @fires {module:events/events#output-error}
         */
        error: function(message) {
            events.dispatch('output-error', message);
        },
        /**
         * Ask the use a question. If an array of valid answers is specified,
         * the callback won't be called until the user's answer is found in the
         * array.
         * @param {Object} params                   configuration object
         * @param {String} params.text              question text
         * @param {Function} params.callback        callback to call on answer
         * @param {Array.<String>} [params.answers] valid answers
         */
        ask: function(params) {
            this.output(params.text);
            this.questions.push(params);
        },
        _answerQuestion: function(text) {
            var question = this.questions[0];
            var answers = question.answers;
            if (answers && answers.indexOf(text) < 0) {
                // question again if answer is invalid
                var allAnswers = answers.join(', ');
                this.error('invalid input, expected: [' + allAnswers + ']');
                this.output(question.text);
                return;
            }
            // remove the current question
            this.questions.splice(0, 1);
            question.callback.call(this, text);
        },
        /**
         * Call a command
         * @param  {String} text
         */
        _callCommand: function(text) {
            if (text === '') {
                return;
            }
            var args = this._getArgsFromText(text);
            // first string is command
            var name = args.splice(0, 1)[0];

            var command, commands = this.commands;
            for(var commandName in commands) {
                if (name === commandName) {
                    command = commands[commandName];
                    break;
                }
            }
            if (!command) {
                this.error('invalid command: ' + name);
                return;
            }
            command.apply(this, args);
        }
    };

    return Extendable.extend(Program, ProgramPrototype);

});