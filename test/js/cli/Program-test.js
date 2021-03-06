define(['cli/Program', 'events/events'], function(Program, events) {

    describe('test/js/cli/Program-test.js', function() {
        var outputs = [], errors = [], exited;
        before(function() {
            events.listen('exit', function() {
                exited = true;
            });
            events.listen('output', function(message) {
                outputs.push(message);
            });
            events.listen('output-error', function(message) {
                errors.push(message);
            });
        });
        after(function() {
            events.clear();
        });

        it('should be a constructor', function() {
            expect(Program).to.be.a('function');
            expect(Program.prototype).to.be.an('object');
        });

        var program, params;
        describe('object construction', function() {
            before(function() {
                params = {
                    name: 'test',
                    defaultAction: function() {
                        this.data.defaultArguments = arguments;
                    },
                    args: {
                        '--help': function() {
                            this.output('usage: test ask-me');
                        },
                        'testArg': function(arg1, arg2) {
                            this.error('an error message' + arg1 + arg2);
                        }
                    }
                };
            });
            it('should create a new instance', function() {
                program = new Program(params);
            });
            it('should set name', function() {
                expect(program.name).to.be('test');
            });
            it('should set defaultAction function', function() {
                expect(program.defaultAction).to.be(params.defaultAction);
            });
            it('should set commands', function() {
                expect(program.commands).to.be(params.commands);
            });
            it('should set args', function() {
                expect(program.args).to.be(params.args);
            });
        });

        describe('init()', function() {
            before(function() {
                errors = [];
                outputs = [];
                exited = false;
            });
            var initText;
            it('should be a function', function() {
                expect(program.init).to.be.a('function');
            });
            it('should call defaultAction() if defined', function() {
                // initText = 'test --help testArg A B';
                program.init('--help', 'testArg', 'A', 'B');
                expect(program.data.defaultArguments).to.be.ok();
                expect(program.data.defaultArguments[0]).to.be('--help');
                expect(program.data.defaultArguments[1]).to.be('testArg');
            });
            it('should call args `--help` callback', function() {
                expect(outputs.length).to.be(1);
                expect(outputs[0]).to.be('usage: test ask-me');
            });
            it('should call `testArg` callback', function() {
                expect(errors.length).to.be(1);
                expect(errors[0]).to.be('an error messageAB');
            });
            it('should exit because no commands & no prompts def', function() {
                expect(exited).to.be(true);
            });
        });
        describe('exit()', function() {
            before(function() {
                exited = false;
            });
            it('should dispatch `exit` event', function() {
                program.exit();
                expect(exited).to.be(true);
            });
        });
        describe('input()', function() {
            before(function() {
                exited = false;
                errors = [];
                outputs = [];
            });
            it('should dispatch `exit` event on `exit`', function() {
                program.input('exit');
                expect(exited).to.be(true);
            });
            it('should fail to call command', function() {
                program.input('non-existing-command');
                expect(errors.length).to.be(1);
                expect(errors[0]).to.be('invalid command: ' +
                    '"non-existing-command"');
            });
        });
        describe('output()', function() {
            before(function() {
                outputs = [];
            });
            it('should fire `output` event', function() {
                program.output('test123');
                expect(outputs.length).to.be(1);
                expect(outputs[0]).to.be('test123');
            });
        });
        describe('error()', function() {
            before(function() {
                errors = [];
            });
            it('should fire `output-error` message', function() {
                program.error('error123');
                expect(errors.length).to.be(1);
                expect(errors[0]).to.be('error123');
            });
        });
        describe('init() with commands', function() {
            before(function() {
                exited = false;
                outputs = [];
                errors = [];
                program.commands = {
                    'command': function(a, b) {
                        this.data.command = {
                            a: a,
                            b: b
                        };
                    },
                    'copy': function() {
                        this.output('copy1');
                    },
                    'order': function() {
                        this.output('order1');
                    }
                };
            });
            it('should not exit if there are available commands', function() {
                program.init('test');
                expect(exited).to.be(false);
            });
        });
        describe('input() for commands', function() {
            it('should call the `command`', function() {
                program.input('command a b');
                expect(program.data.command).to.be.an('object');
                expect(program.data.command.a).to.be('a');
                expect(program.data.command.b).to.be('b');
            });
        });
        describe('autocomplete() for commands', function() {
            it('should suggest `copy` and `command` for `co`', function() {
                var suggestions = program.autocomplete('co');
                expect(suggestions[0]).to.be('command');
                expect(suggestions[1]).to.be('copy');
            });
        });
        describe('ask(), input() and autocomplete()', function() {
            before(function() {
                errors = [];
                outputs = [];
                exited = false;
            });
            it('should output the question', function() {
                 program.ask({
                    text: 'choose a number between one and two',
                    answers: ['number one', 'number two', 'three'],
                    callback: function(answer) {
                        this.data.answer = answer;
                    }
                });
                expect(program.questions.length).to.be(1);

                expect(outputs.length).to.be(1);
                expect(outputs[0]).to.be('choose a number between one ' +
                    'and two');
            });
            it('autocomplete() should suggest answers', function() {
                var suggestions = program.autocomplete('number');
                expect(suggestions.length).to.be(2);
                expect(suggestions[0]).to.be('number one');
                expect(suggestions[1]).to.be('number two');
            });
            it('input() should give error on invalid input', function() {
                program.input('bla');
                expect(outputs.length).to.be(2);
                expect(errors.length).to.be(1);
                expect(errors[0].match(/invalid input/)).to.be.ok();
                // same question should be asked again
                expect(outputs[1]).to.be(outputs[0]);
            });
            it('input() should call callback on valid answer', function() {
                program.input('number two');
                expect(program.data.answer).to.be('number two');
                expect(program.questions.length).to.be(0);
            });
            it('input() should call commands afterwards', function() {
                program.input('copy');
                expect(outputs[2]).to.be('copy1');
            });
        });
    });

});