/**
 * Handles and writes output
 * @module cli/output
 */
define(['events/events'], function(events) {

    // function outputText(text, err) {
    //     var p = exports._createTextElement('p');
    //     if (err) {
    //         p.className = 'error';
    //     }
    //     p.innerHTML = text;
    //     exports._element.appendChild(p);

    //     exports._scrollToBottom();
    // }

    // var queue = [], interval;
    // function output(text, err) {
    //     queue.push({
    //         text: text,
    //         error: err
    //     });
    //     if (interval) {
    //         return;
    //     }
    //     interval = setInterval(function() {
    //         if (queue.length === 0) {
    //             clearInterval(interval);
    //             interval = undefined;
    //             return;
    //         }
    //         var data = queue.splice(0, 1)[0];
    //         outputText(data.text, data.error);
    //     }, 50);
    // }

    var exports = {
        _scrollToBottom: function() {
            window.scrollTo(0,document.body.scrollHeight);
        },
        _prefixes: undefined,
        _createTextElement: function(text, className) {
            var p = document.createElement('p');
            p.innerHTML = text;
            p.className = className;
            return p;
        },
        _onOutput: function(text) {
            var p = this._createTextElement(text);
            this._element.appendChild(p);

            this._scrollToBottom();
            // output(text);
        },
        _onOutputError: function(text) {
            var p = this._createTextElement(text, 'error');
            this._element.appendChild(p);

            this._scrollToBottom();
            // output(text, true);
        },
        _onOutputClear: function() {
            this._element.innerHTML = '';
        },
        init: function(element) {
            this._element = element;

            events.listen('output', this._onOutput, this);
            events.listen('output-error', this._onOutputError, this);
            events.listen('output-clear', this._onOutputClear, this);
        }
    };

    return exports;

});