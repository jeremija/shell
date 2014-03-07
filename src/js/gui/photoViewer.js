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

    function removeListener(element, name, callback) {
        if (element.detachEvent) {
            element.detachEvent(name, callback);
            return;
        }
        element.removeEventListener(name, callback);
    }

    function findIndex(element, elements) {
        var all = elements;
        for (var index = 0; index < all.length; index++) {
            var sibling = all[index];
            if (sibling === element) {
                break;
            }
        }
        return index;
    }

    function getFullSrcUrls(elements) {
        var urls = [];
        for(var i = 0; i < elements.length; i++) {
            var el = elements[i];
            urls.push(el.getAttribute('data-fullsrc'));
        }
        return urls;
    }

    var exports = {
        KEY_LEFT: 37,
        KEY_RIGHT: 39,
        KEY_ESCAPE: 27,
        _listenElement: undefined,
        _viewerElement: undefined,
        _imgElement: undefined,

        _switchImage: function(index) {
            var data = this.data;
            if (index >= data.urls.length || index < 0) {
                return;
            }
            data.index = index;
            // this._viewerElement.style.backgroundImage =
            //     'url("' + data.urls[index] + '")';
            this._imgElement.setAttribute('src', data.urls[index]);
        },
        data: {
            index: -1,
            urls: []
        },

        next: function() {
            var data = exports.data;
            if (data.index + 1 >= data.urls.length) {
                // prevent out of bounds
                return;
            }
            exports._switchImage(++data.index);
        },
        previous: function() {
            var data = exports.data;
            if (data.index === 0) {
                // prevent out of bounds
                return;
            }
            exports._switchImage(--data.index);
        },
        close: function() {
            removeListener(document, 'keydown', exports._onKeyDown);

            exports._viewerElement.style.display = 'none';
            exports._imgElement.removeAttribute('src');
            exports.data.index = -1;
            exports.data.urls = [];

            events.dispatch('input-enable');
        },
        show: function(index) {
            events.dispatch('input-disable');
            addListener(document, 'keydown', this._onKeyDown);

            this._viewerElement.style.display = 'block';
            this._viewerElement.focus();
            this._switchImage(index);
        },
        _onKeyDown: function(event) {
            var keyCode = event.keyCode;
            if (keyCode !== exports.KEY_LEFT && keyCode !== exports.KEY_RIGHT &&
                keyCode !== exports.KEY_ESCAPE) {
                return;
            }
            event.preventDefault();
            if (keyCode === exports.KEY_LEFT) {
                exports.previous();
                return;
            }
            if (keyCode === exports.KEY_RIGHT) {
                exports.next();
                return;
            }
            // ESCAPE
            exports.close();
        },
        _onClick: function(event) {
            var element = event.target;
            if (!element || element.tagName !== 'IMG') {
                return;
            }

            var elements = element.parentElement.children;
            var index = findIndex(element, elements);
            exports.data.index = index;
            exports.data.urls = getFullSrcUrls(elements);

            exports.show(index);
        },
        _onPhotos: function(photos) {
            exports.data.urls = photos;
            exports.show(0);
        },
        init: function(viewerElement, listenElement) {
            this._viewerElement = viewerElement;
            this._listenElement = listenElement;

            addListener(listenElement, 'click', this._onClick);
            this.initLayout();
            viewerElement.style.display = 'none';

            events.listen('photos', this._onPhotos);
        },
        initLayout: function() {
            var viewerElement = this._viewerElement;

            viewerElement.innerHTML = '';
            var nav = document.createElement('div');
            nav.className = 'photo-viewer-nav';

            nav.appendChild(this._addLink('[<]', this.previous, 'nav-left'));
            nav.appendChild(this._addLink('[close]', this.close, 'nav-close'));
            nav.appendChild(this._addLink('[>]', this.next, 'nav-right'));

            var img = this._imgElement = document.createElement('img');
            viewerElement.appendChild(nav);
            viewerElement.appendChild(img);
        },
        _addLink: function(text, clickCallback, className) {
            var a = document.createElement('a');
            a.innerHTML = text;
            a.onclick = clickCallback;
            a.setAttribute('href', '#');
            a.className = className;
            return a;
        },
        clear: function() {
            events.unlisten('photos', this._onPhotos);
            this._viewerElement.innerHTML = '';
        }
    };

    return exports;
});