define(['cli/input', 'events/events'], function(input, events) {

    var BACKSPACE_KEY = 8;
    var TAB_KEY = 9;
    var ENTER_KEY = 13;
    var UP_KEY = 38;
    var DOWN_KEY = 40;

    describe('test/js/cli/input-test.js', function() {
        var listenElement, prefixElement, displayElement,
        lastInput, lastInputAutocomplete, lastOutput;
        before(function() {
            events.clear();

            listenElement = document.createElement('input');
            listenElement.setAttribute('type', 'text');
            prefixElement = document.createElement('span');
            displayElement = document.createElement('span');

            events.listen('input', function(text, autocomplete) {
                lastInput = text;
                lastInputAutocomplete = autocomplete;
            });
            events.listen('output', function(text) {
                lastOutput = text;
            });
        });
        after(function() {
            events.clear();
        });

        function fakeKeyDown(keyCode) {
            listenElement.onkeydown({
                keyCode: keyCode,
                preventDefault: function() {}
            });
        }

        function fakeKeyPress(keyCode) {
            listenElement.onkeypress({
                keyCode: keyCode,
                preventDefault: function() {}
            });
        }

        it('should be an object', function() {
            expect(input).to.be.an('object');
        });

        describe('init()', function() {
            it('should be a function', function() {
                expect(input.init).to.be.a('function');
            });
            it('should set the elements properties', function() {
                input.init({
                    listenElement: listenElement,
                    prefixElement: prefixElement,
                    displayElement: displayElement
                });
                expect(input._listenElement).to.be(listenElement);
                expect(input._prefixElement).to.be(prefixElement);
                expect(input._displayElement).to.be(displayElement);
            });
            it('should listen to `active-program` event', function() {
                events.dispatch('active-program', 'abcd');
                expect(input._activeProgramName).to.be('abcd');
            });
            it('should listen to `autocomplete` event', function() {
                lastOutput = undefined;

                events.dispatch('autocomplete', ['abcdef']);
                expect(input._displayElement.innerHTML).to.be('abcdef');
                expect(lastOutput).to.be(undefined);

                input._displayElement.innerHTML = '';

                events.dispatch('autocomplete', ['abcd', 'ef']);
                expect(input._displayElement.innerHTML).to.be('');
                expect(lastOutput).to.be('abcd   ef');
            });
        });
        describe('listenElement onkeydown event', function() {
            it('should trigger the `input` event on enter key', function() {
                displayElement.innerHTML = '0';
                fakeKeyDown(ENTER_KEY);
                expect(lastInput).to.be('0');
                expect(lastOutput).to.be('abcd$ 0');
                expect(displayElement.innerHTML).to.be('');

                displayElement.innerHTML = '1';
                fakeKeyDown(ENTER_KEY);
                expect(lastInput).to.be('1');
                expect(lastOutput).to.be('abcd$ 1');

                displayElement.innerHTML = '2';
                fakeKeyDown(ENTER_KEY);
                expect(lastInput).to.be('2');
            });
            it('should cycle previous inputs on up/down keys', function() {
                fakeKeyDown(UP_KEY);
                expect(displayElement.innerHTML).to.be('2');
                fakeKeyDown(UP_KEY);
                expect(displayElement.innerHTML).to.be('1');

                fakeKeyDown(DOWN_KEY);
                expect(displayElement.innerHTML).to.be('2');
                fakeKeyDown(DOWN_KEY);
                expect(displayElement.innerHTML).to.be('');
                fakeKeyDown(DOWN_KEY);
                expect(displayElement.innerHTML).to.be('');
                fakeKeyDown(DOWN_KEY);
                expect(displayElement.innerHTML).to.be('');

                fakeKeyDown(UP_KEY);
                expect(displayElement.innerHTML).to.be('2');
                fakeKeyDown(UP_KEY);
                expect(displayElement.innerHTML).to.be('1');
                fakeKeyDown(UP_KEY);
                expect(displayElement.innerHTML).to.be('0');
                fakeKeyDown(UP_KEY);
                expect(displayElement.innerHTML).to.be('0');
                fakeKeyDown(UP_KEY);
                expect(displayElement.innerHTML).to.be('0');
                fakeKeyDown(DOWN_KEY);
                expect(displayElement.innerHTML).to.be('1');
            });
            it('should trigger `input` w/ autucomplete on tab key', function() {
                displayElement.innerHTML = 'a';
                fakeKeyDown(TAB_KEY);
                expect(lastInputAutocomplete).to.be(true);
            });
            it('should remove last character on backspace key', function() {
                displayElement.innerHTML = 'abcdef';
                fakeKeyDown(BACKSPACE_KEY);
                expect(displayElement.innerHTML).to.be('abcde');
            });
        });
        describe('listenElement `onkeypress event', function() {
            it('should update displayElement with characters', function() {
                displayElement.innerHTML = '';
                // char A
                fakeKeyPress(65);
                expect(displayElement.innerHTML).to.be('A');
                fakeKeyPress(66);
                fakeKeyPress(67);
                expect(displayElement.innerHTML).to.be('ABC');
            });
        });
    });

});