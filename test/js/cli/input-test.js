define(['cli/input', 'events/events'], function(input, events) {

    var BACKSPACE_KEY = 8;
    var TAB_KEY = 9;
    var ENTER_KEY = 13;
    var UP_KEY = 38;
    var DOWN_KEY = 40;

    describe('test/js/cli/input-test.js', function() {
        var inputElement, prefixElement, formElement,
            lastInput, lastInputAutocomplete, lastOutput;
        before(function() {
            events.clear();

            inputElement = document.createElement('input');
            inputElement.setAttribute('type', 'text');
            prefixElement = document.createElement('span');
            formElement = document.createElement('form');

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
            inputElement.onkeydown({
                keyCode: keyCode,
                preventDefault: function() {}
            });
        }

        function fakeKeyPress(keyCode) {
            inputElement.onkeypress({
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
                    inputElement: inputElement,
                    prefixElement: prefixElement,
                    formElement: formElement
                });
                expect(input._inputElement).to.be(inputElement);
                expect(input._prefixElement).to.be(prefixElement);
                expect(input._formElement).to.be(formElement);
            });
            it('should listen to `active-program` event', function() {
                events.dispatch('active-program', 'abcd');
                expect(input._activeProgramName).to.be('abcd');
            });
            it('should listen to `autocomplete` event', function() {
                lastOutput = undefined;

                events.dispatch('autocomplete', ['abcdef']);
                expect(input._inputElement.value).to.be('abcdef');
                expect(lastOutput).to.be(undefined);

                input._inputElement.value = '';

                events.dispatch('autocomplete', ['abcd', 'ef']);
                expect(input._inputElement.value).to.be('');
                expect(lastOutput).to.be('abcd   ef');
            });
            it('should listen to `input-disable` event', function() {
                events.dispatch('input-disable');
                expect(input._inputElement.getAttribute('disabled')).to.be.ok();
            });
            it('should listen to `input-enable` event', function() {
                events.dispatch('input-enable');
                expect(input._inputElement.getAttribute('disabled')).
                    to.not.be.ok();
            });
        });
        describe('inputElement onkeydown event', function() {
            it('should trigger the `input` event on enter key', function() {
                inputElement.value = '0';
                formElement.onsubmit({
                    preventDefault: function() {}
                });
                expect(lastInput).to.be('0');
                expect(lastOutput).to.be('abcd$ 0');
                expect(inputElement.value).to.be('');

                inputElement.value = '1';
                formElement.onsubmit({
                    preventDefault: function() {}
                });
                expect(lastInput).to.be('1');
                expect(lastOutput).to.be('abcd$ 1');

                inputElement.value = '2';
                formElement.onsubmit({
                    preventDefault: function() {}
                });
                expect(lastInput).to.be('2');
            });
            it('should cycle previous inputs on up/down keys', function() {
                fakeKeyDown(UP_KEY);
                expect(inputElement.value).to.be('2');
                fakeKeyDown(UP_KEY);
                expect(inputElement.value).to.be('1');

                fakeKeyDown(DOWN_KEY);
                expect(inputElement.value).to.be('2');
                fakeKeyDown(DOWN_KEY);
                expect(inputElement.value).to.be('');
                fakeKeyDown(DOWN_KEY);
                expect(inputElement.value).to.be('');
                fakeKeyDown(DOWN_KEY);
                expect(inputElement.value).to.be('');

                fakeKeyDown(UP_KEY);
                expect(inputElement.value).to.be('2');
                fakeKeyDown(UP_KEY);
                expect(inputElement.value).to.be('1');
                fakeKeyDown(UP_KEY);
                expect(inputElement.value).to.be('0');
                fakeKeyDown(UP_KEY);
                expect(inputElement.value).to.be('0');
                fakeKeyDown(UP_KEY);
                expect(inputElement.value).to.be('0');
                fakeKeyDown(DOWN_KEY);
                expect(inputElement.value).to.be('1');
            });
            it('should trigger `input` w/ autucomplete on tab key', function() {
                inputElement.value = 'a';
                fakeKeyDown(TAB_KEY);
                expect(lastInputAutocomplete).to.be(true);
            });
        });
        describe('escaping input', function() {
            it('should escape outputted input', function() {

            });
        });
    });

});