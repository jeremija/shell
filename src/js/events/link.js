/**
 * Listens to link event and opens a link in a new window
 * @module events/link
 */
define(['events/events'], function(events) {

    var exports = {
        openLink: function(href) {
            window.open(href, '_blank');
        },
        _onLink: function(href) {
            events.dispatch('output',
                'Attempting to open a window with link: ' +
                '<a href="' + href + '" target="_blank">' + href + '</a>');
            events.dispatch('output',
                'If you have a popup blocker, click on the link above');
            this.openLink(href);
        },
        init: function() {
            events.listen('link', this._onLink, this);
        }
    };

    return exports;

});