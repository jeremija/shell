define(['events/events'], function(events) {

    var exports = {
        _prefixes: undefined,
        _onPrefix: function(prefix) {
            this._prefix = prefix;
        },
        _createTextElement: function(text) {
            var p = document.createElement('p');
            p.innerHTML = this._prefix + '$ ' + text;
            return p;
        },
        _onOutput: function(text) {
            var p = this._createTextElement(text);
            this._element.appendChild(p);
        },
        _onOutputError: function(text) {
            var p = this._createTextElement(text);
            p.className = 'error';
            this._element.appendChild(p);
        },
        _onOutputClear: function() {
            this._element.innerHTML = '';
        },
        init: function(element) {
            this._element = element;

            events.listen('prefix', this._onPrefix, this);
            events.listen('output', this._onOutput, this);
            events.listen('output-error', this._onOutputError, this);
            events.listen('output-clear', this._onOutputClear, this);
        }
    };

    return exports;

});