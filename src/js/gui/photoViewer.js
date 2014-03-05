/**
 * Module for displaying full size photos
 * @module gui/photoViewer
 */
define(['events/events'], function(events) {

    function addListener(element, name, callback) {
        if (element.attachEvent) {
            element.attachEvent(name, callback);
            return;
        }
        element.addEventListener(name, callback);
    }

    function removeListener(element, name, callbacK) {
        if (element.detachEvent) {
            element.detachEvent(name, callback);
            return;
        }
        element.removeEventListener(name, callback);
    }

    function findIndex(element) {
        var all = element.parentElement.children;
        for (var index in all) {
            var sibling = all[i];
            if (sibling === element) {
                break;
            }
        }
        return index;
    }

    var exports = {
        _listenElement: undefined,
        _viewerElement: undefined,

        _imgElement: undefined,

        data: {
            index: 0
        },

        next: function() {

        },
        previous: function() {

        },
        close: function() {
            this._listenElement.style.display = 'none';
        },
        show: function(element) {
            this._listenElement.style.display = 'block';
            var index = findIndex(element);

            this._imgElement.setAttribute('src', element.getAttribute(''));
        },
        _onClick: function(event) {
            var element = event.target;
            if (!element || element.tagName !== 'IMG') {
                return;
            }
            var index = findIndex(element);

        },
        init: function(viewerElement, listenElement) {
            addListener(listenElement, 'click', this._onClick);
        },
        clear: function() {

        }
    };

    return exports;
});