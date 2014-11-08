/**
 * Module for displaying full size photos
 * @module gui/photoViewer
 */
define(['events/events', 'gui/isIframe'], function(events, isIframe) {

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
        _nextElement: undefined,
        _prevElement: undefined,

        _switchImage: function(index) {
            var data = this.data;
            var urls = data.urls;
            if (index >= data.urls.length || index < 0) {
                return;
            }
            data.index = index;
            this._imgElement.setAttribute('src', urls[index]);
            this._prevElement.style.visibility = index === 0 ? 'hidden' : '';
            this._nextElement.style.visibility = index + 1 === urls.length ?
                'hidden' : '';
        },
        data: {
            index: -1,
            urls: []
        },

        next: function(event) {
            if (event) {
                event.preventDefault();
            }
            var data = exports.data;
            if (data.index + 1 >= data.urls.length) {
                // prevent out of bounds
                return;
            }
            exports._switchImage(++data.index);
        },
        previous: function(event) {
            if (event) {
                event.preventDefault();
            }
            var data = exports.data;
            if (data.index === 0) {
                // prevent out of bounds
                return;
            }
            exports._switchImage(--data.index);
        },
        close: function(event) {
            if (event) {
                event.preventDefault();
            }
            removeListener(document, 'keydown', exports._onKeyDown);

            exports._viewerElement.className = 'invisible';
            // exports._imgElement.removeAttribute('src');
            exports.data.index = -1;
            exports.data.urls = [];

            events.dispatch('input-enable');
        },
        show: function(index) {
            events.dispatch('input-disable');
            addListener(document, 'keydown', this._onKeyDown);
            exports._imgElement.removeAttribute('src');

            this._viewerElement.className = '';
            if (!isIframe) this._viewerElement.focus();
            // this._viewerElement.scrollIntoView();
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
        _onPhotos: function(photos, index) {
            exports.data.urls = photos;
            index = (index > 0 && index <= photos.length) ? index - 1 : 0;
            exports.show(index);
        },
        init: function(viewerElement, listenElement) {
            this._viewerElement = viewerElement;
            this._listenElement = listenElement;

            addListener(listenElement, 'click', this._onClick);
            this.initLayout();
            viewerElement.className = 'invisible';

            events.listen('photos', this._onPhotos);
        },
        initLayout: function() {
            var viewerElement = this._viewerElement;

            viewerElement.innerHTML = '';
            var nav = document.createElement('div');
            nav.className = 'photo-viewer-nav';

            this._prevElement = this._link('[&lt;]', this.previous, 'nav-left');
            this._nextElement= this._link('[&gt;]', this.next, 'nav-right');

            nav.appendChild(this._prevElement);
            nav.appendChild(this._link('[close]', this.close, 'nav-close'));
            nav.appendChild(this._nextElement);

            var img = this._imgElement = document.createElement('img');
            var container = document.createElement('div');
            container.className = 'photo-container';
            container.appendChild(nav);
            container.appendChild(img);
            viewerElement.appendChild(container);
        },
        _link: function(text, clickCallback, className) {
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