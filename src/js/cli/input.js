/**
 * Handles user input
 * @module cli/input
 */
define(['events/events'], function(events) {

    var BACKSPACE_KEY = 8;
    var TAB_KEY = 9;
    var ENTER_KEY = 13;
    var UP_KEY = 38;
    var DOWN_KEY = 40;

    var exports = {
        _scrollToBottom: function() {
            window.scrollTo(0,document.body.scrollHeight);
        },
        history: undefined,
        historyIndex: -1,
        _activeProgramName: undefined,
        _listenInput: function() {
            var self = this;

            this._listenElement.onkeydown = function(event) {
                var keyCode = event.keyCode;
                switch(keyCode) {
                    case BACKSPACE_KEY:
                        event.preventDefault();
                        self._onBackspace();
                        break;
                    case TAB_KEY:
                        event.preventDefault();
                        self._onTab();
                        break;
                    case ENTER_KEY:
                        event.preventDefault();
                        self._onEnter();
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

            this._listenElement.onkeypress = function(event) {
                var keyCode = event.keyCode;
                if (keyCode >= 32 && keyCode <= 126){
                    event.preventDefault();
                    self._onType(keyCode);
                }
            };
        },
        /**
         * Initializes the console input
         * @param {Object} params
         * @param {HTMLElement} params.listenElement
         * @param {HTMLElement} params.prefixElement
         * @param {HTMLElement} params.displayElement
         */
        init: function(params) {
            this._listenElement = params.listenElement;
            this._prefixElement = params.prefixElement;
            this._displayElement = params.displayElement;
            this.history = [];
            this.historyIndex = 0;

            var self = this;

            this._listenInput();

            events.listen('active-program', this._onActiveProgram, this);
            events.listen('autocomplete', this._onAutocomplete, this);
        },
        _onType: function(keyCode) {
            var character = String.fromCharCode(keyCode);
            var text = this._displayElement.innerHTML || '';
            this._displayElement.innerHTML = text + character;
            this._scrollToBottom();
        },
        _onAutocomplete: function(suggestions) {
            var displayElement = this._displayElement;

            if (suggestions.length === 0) {
                return;
            }
            if (suggestions.length === 1) {
                displayElement.innerHTML = suggestions[0];
                return;
            }
            this._output(displayElement.innerHTML);
            events.dispatch('output', suggestions.join('   '));
            this._scrollToBottom();
        },
        _onActiveProgram: function(name) {
            this._activeProgramName = name;
            this._prefixElement.innerHTML = name;
        },
        _onBackspace: function() {
            var displayElement = this._displayElement;
            var text = displayElement.innerHTML  || '';
            text = text.slice(0, text.length - 1);
            displayElement.innerHTML = text;
            this._scrollToBottom();
        },
        _onTab: function() {
            var text = this._displayElement.innerHTML;
            // trigger input event with autocomplete
            events.dispatch('input', text, true);
            this._scrollToBottom();
        },
        _output: function(text) {
            events.dispatch('output', this._activeProgramName + '$ ' + text);
        },
        _onEnter: function() {
            var displayElement = this._displayElement;
            var text = displayElement.innerHTML;
            displayElement.innerHTML = '';

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
            this._displayElement.innerHTML = text || '';
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
            this._displayElement.innerHTML = text || '';
            this._scrollToBottom();
        }
    };

    return exports;

});