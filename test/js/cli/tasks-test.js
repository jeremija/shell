define(['cli/tasks', 'events/events', 'cli/Shell'],
    function(tasks, events, Shell) {

    describe('test/js/cli/tasks-test.js', function() {
        var activeProgram, shell, program1, program2,
        shellInput, input1, input2, initArgs1, initArgs2, suggestions;
        before(function() {
            events.clear();

            events.listen('active-program', function(name) {
                activeProgram = name;
            });
            events.listen('autocomplete', function(sugg) {
                suggestions = sugg;
            });

            shell = new Shell({
                name: 'shellName'
            });
            shell.init();
            // mock shell input
            shell.input = function(text) {
                shellInput = text;
            };
            shell.autocomplete = function(text) {
                return ['a', 'b'];
            };

            program1 = {
                name: 'program1',
                input: function(text) {
                    input1 = text;
                },
                init: function(/* variable args */) {
                    initArgs1 = arguments;
                }
            };

            program2 = {
                name: 'program2',
                input: function(text) {
                    input2 = text;
                },
                init: function(/* variable args */) {
                    initArgs2 = arguments;
                }
            };
        });
        after(function() {
            events.clear();
        });

        it('should be an object', function() {
            expect(tasks).to.be.an('object');
        });

        describe('init()', function() {
            it('should be a function', function() {
                expect(tasks.init).to.be.a('function');
            });
            it('should set the shell', function() {
                tasks.init({
                    shell: shell
                });

                expect(tasks.shell).to.be(shell);
            });
            it('should set the stack', function() {
                expect(tasks.stack).to.be.an('array');
            });
            it('should dispatch `active-program` event', function() {
                expect(activeProgram).to.be('shellName');
            });
            it('should start listening to events', function() {
                expect(events._listeners.input[0].callback).to.be(
                    tasks._onInput);
                expect(events._listeners.init[0].callback).to.be(
                    tasks._onInit);
                expect(events._listeners.exit[0].callback).to.be(
                    tasks._onExit);
            });
        });
        describe('event `input`', function() {
            before(function() {
                shellInput = undefined;
                input1 = undefined;
                input2 = undefined;
                suggestions = undefined;
            });
            it('should issue commands to the shell', function() {
                events.dispatch('input', 'abcdefgh');

                expect(shellInput).to.be('abcdefgh');
                expect(input1).to.be(undefined);
                expect(input2).to.be(undefined);
                expect(suggestions).to.be(undefined);
            });
            it('should dispatch `autocomplete` event', function() {
                events.dispatch('input', 'abcde', true);
                expect(suggestions).to.be.an('array');
            });
        });
        describe('event `init`', function() {
            before(function() {
                shellInput = undefined;
                input1 = undefined;
                input2 = undefined;
            });
            it('should push the program to the stack', function() {
                events.dispatch('init', program1, ['arg1', 'arg2']);
                expect(initArgs1).to.be.ok();
                expect(initArgs1[0]).to.be('arg1');
                expect(initArgs1[1]).to.be('arg2');

                expect(tasks.stack.length).to.be(1);
                expect(tasks.getActiveProgram()).to.be(program1);
            });
            it('`input` should issue commands to the program1', function() {
                events.dispatch('input', 'abcd efgh');

                expect(shellInput).to.be(undefined);
                expect(input1).to.be('abcd efgh');
                expect(input2).to.be(undefined);
            });
            it('should push another program to the stack', function() {
                events.dispatch('init', program2, ['arg3']);
                expect(initArgs2).to.be.ok();
                expect(initArgs2[0]).to.be('arg3');

                expect(tasks.stack.length).to.be(2);
                expect(tasks.getActiveProgram()).to.be(program2);
            });
        });
        describe('event `exit`', function() {
            it('should pop the program from the stack', function() {
                events.dispatch('exit');
                expect(tasks.stack.length).to.be(1);
                // return to the last active program
                expect(tasks.getActiveProgram()).to.be(program1);

                events.dispatch('exit');
                expect(tasks.stack.length).to.be(0);
                // return to the last active program
                expect(tasks.getActiveProgram()).to.be(tasks.shell);
            });
            it('`input` should issue commands to the shell again', function() {
                events.dispatch('input', '12345');
                expect(shellInput).to.be('12345');
            });
        });
    });

});