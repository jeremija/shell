/**
 * Contains utility functions
 * @module cli/util
 */
define([], function() {

    var exports = {
        /**
         * Escapes HTML characters
         * @param  {String} text
         * @return {String} text with escaped HTML characters
         */
        escape: function(text) {
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(text));
            return div.innerHTML;
        }
    };

    return exports;

});