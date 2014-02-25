/**
 * Handles user input
 * @module cli/input
 */
define(['events/events'], function(events) {

    // var BACKSPACE_KEY = 8;
    // var ENTER_KEY = 13;
    var TAB_KEY = 9;
    var UP_KEY = 38;
    var DOWN_KEY = 40;

    var exports = {
        _scrollToBottom: function() {
            window.scrollTo(0, document.body.scrollHeight);
        },
        history: undefined,
        historyIndex: -1,
        _activeProgramName: undefined,
        _listenInput: function() {
            var self = this;

            this._inputElement.onkeydown = function(event) {
                switch(event.keyCode) {
                    case TAB_KEY:
                        event.preventDefault();
                        self._onTab();
                        break;
                    case UP_KEY:
                        event.preventDefault();
                        self._onUp();
                        break;
                    case DOWN_KEY:
                        event.preventDefault();
                        self._onDown();
                        break;
                }
            };

            this._formElement.onsubmit = function(event) {
                event.preventDefault();
                self._onEnter();
            };

        },
        /**
         * Initializes the console input
         * @param {Object} params
         * @param {HTMLInputElement} params.inputElement
         * @param {HTMLFormElement} params.formElement
         * @param {HTMLSpanElement} params.prefixElement
         */
        init: function(params) {
            this._inputElement = params.inputElement;
            this._formElement = params.formElement;
            this._prefixElement = params.prefixElement;

            this.history = [];
            this.historyIndex = 0;

            var self = this;

            this._listenInput();

            events.listen('active-program', this._onActiveProgram, this);
            events.listen('autocomplete', this._onAutocomplete, this);
        },
        _onAutocomplete: function(suggestions) {
            var inputElement = this._inputElement;

            if (suggestions.length === 0) {
                return;
            }
            if (suggestions.length === 1) {
                inputElement.value = suggestions[0];
                return;
            }
            this._output(inputElement.value);
            events.dispatch('output', suggestions.join('   '));
            this._scrollToBottom();
        },
        _onActiveProgram: function(name) {
            this._activeProgramName = name;
            this._prefixElement.innerHTML = name;
        },
        _onTab: function() {
            var text = this._inputElement.value;
            // trigger input event with autocomplete
            events.dispatch('input', text, true);
            this._scrollToBottom();
        },
        _output: function(text) {
            events.dispatch('output', this._activeProgramName + '$ ' + text);
        },
        _onEnter: function() {
            var inputElement = this._inputElement;
            var text = inputElement.value;
            inputElement.value = '';

            if (text && text.length) {
                this.history.push(text);
                this.historyIndex = this.history.length;
            }

            this._output(text);
            events.dispatch('input', text);
        },
        _onUp: function() {
            --this.historyIndex;
            if (this.historyIndex < 0) {
                this.historyIndex = 0;
            }
            var index = this.historyIndex;
            var text = this.history[index];
            this._inputElement.value = text || '';
            this._scrollToBottom();
        },
        _onDown: function() {
            var length = this.history.length;
            ++this.historyIndex;
            if (this.historyIndex > length) {
                this.historyIndex = length;
            }
            var index = this.historyIndex;
            var text = this.history[index];
            this._inputElement.value = text || '';
            this._scrollToBottom();
        }
    };

    return exports;

});