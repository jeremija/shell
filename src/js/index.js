(function() {
    if (typeof Object.create !== 'function' ||
        typeof Array.prototype.forEach !== 'function') {
        var output =
            'Please <a href="http://browsehappy.com/">update your browser</a>.' +
            '<br>You are running an old browser and you may not have ' +
            'the best experience.';
        document.getElementById('console-output').innerHTML = output;
    }
}());

require(['cli/input', 'cli/output', 'cli/tasks',
    'programs/defaultShell', 'programs/all', 'events/link', 'gui/photoViewer',
    'gui/isIframe'],
    function(input, output, tasks, defaultShell, allPrograms, link,
        photoViewer, isIframe) {

    link.init();

    var inputElement = document.getElementById('input');
    var outputElement = document.getElementById('console-output');
    var formElement = document.getElementById('input-form');
    if (!isIframe) inputElement.focus();

    document.onclick = function(event) {
        inputElement.focus();
    };

    input.init({
        inputElement: inputElement,
        formElement: formElement,
        prefixElement: document.getElementById('input-prefix'),
    });
    output.init(outputElement);

    defaultShell.init();
    for (var i in allPrograms) {
        var program = allPrograms[i];
        defaultShell.registerProgram(program);
    }

    tasks.init({
        shell: defaultShell
    });

    var photoViewerElement = document.getElementById('photo-viewer');
    photoViewer.init(photoViewerElement, outputElement);

    var hash = decodeURIComponent(window.location.hash);
    if (hash) {
        var value = hash.substring(1, hash.length);
        var tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        inputElement.value = value.replace(/[&<>]/g, function(tag) {
            return tagsToReplace[tag] || tag;
        });
        // inputElement.value = value;
        input._onEnter();
    }
});