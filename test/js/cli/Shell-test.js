define(['cli/Shell', 'cli/Program', 'events/events'],
    function(Shell, Program, events) {

    describe('test/js/cli/Shell-test.js', function() {
        var outputs = [], errors = [], exited = false;
        before(function() {
            events.listen('output', function(text) {
                outputs.push(text);
            });
            events.listen('output-error', function(text) {
                errors.push(text);
            });
            events.listen('exit', function() {
                exited = true;
            });
        });
        after(function() {
            events.clear();
        });

        it('should inherit Program', function() {
            expect(Program.prototype.isPrototypeOf(Shell.prototype));
        });

        var shell;
        describe('object construction', function() {
            it('should create new shell instance', function() {
                shell = new Shell({
                    name: 'shell',
                    commands: {
                        'help': function() {
                            this.output('this is help');
                        },
                    }
                });
            });
        });
        describe('registerProgram()', function() {
            var testProgram, initData;
            before(function() {
                outputs = [];
                errors = [];
                exited = false;
                testProgram = new Program({
                    name: 'test-program',
                });
                events.listen('init', function(program, args) {
                    initData = arguments;
                });
            });
            it('should register program', function() {
                shell.registerProgram(testProgram);
                expect(shell.commands['test-program']).to.be.ok();
            });
            it('should dispatch `init` event on input', function() {
                shell.input('test-program ab cd');

                expect(initData).to.be.ok();
                expect(initData.length).to.be(2);
                expect(initData[0]).to.be(testProgram);
                var args = initData[1];
                expect(args).to.be.ok();
                expect(args[0]).to.be('ab');
                expect(args[1]).to.be('cd');
            });
        });
    });

});