define([], function() {
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

    var exports = {
        addListener: addListener,
        removeListener: removeListener
    };

    return exports;
});