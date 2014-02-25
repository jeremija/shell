define(['cli/output', 'events/events'], function(output, events) {

    describe('test/js/cli/output-test.js', function() {
        var element;
        before(function() {
            element = document.createElement('div');
            events.clear();
        });
        after(function() {
            events.clear();
        });

        it('should be an object', function() {
            expect(output).to.be.an('object');
        });

        describe('init()', function() {
            it('should be a function', function() {
                expect(output.init).to.be.a('function');
            });
            it('should start listening to events', function() {
                output.init(element);

                expect(events._listeners.output[0].callback).to.be(
                    output._onOutput);
                expect(events._listeners['output-error'][0].callback).to.be(
                    output._onOutputError);
            });
        });
        describe('event `output`', function() {
            before(function() {
                element.innerHTML = '';
            });
            it('shoudl append output to element', function() {
                events.dispatch('output', 'test output');

                expect(element.childNodes.length).to.be(1);
                var p = element.childNodes[0];
                expect(p.tagName).to.be('P');
                expect(p.innerHTML).to.be('test output');
            });
        });
        describe('event `output-error`', function() {
            before(function() {
                element.innerHTML = '';
            });
            it('should append error output to element', function() {
                events.dispatch('output-error', 'test error output');

                expect(element.childNodes.length).to.be(1);
                var p = element.childNodes[0];
                expect(p.tagName).to.be('P');
                expect(p.className).to.be('error');
                expect(p.innerHTML).to.be('test error output');
            });
        });
        describe('event `clear`', function() {
            before(function() {
                element.innerHTML = 'abladabla';
            });
            it('should clear the elements\' innerHTML', function() {
                events.dispatch('output-clear');
                expect(element.innerHTML).to.be('');
            });
        });
    });

});