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
    'programs/defaultShell', 'programs/all', 'events/link', 'gui/photoViewer'],
    function(input, output, tasks, defaultShell, allPrograms, link,
        photoViewer) {

    link.init();

    var inputElement = document.getElementById('input');
    var outputElement = document.getElementById('console-output');
    inputElement.focus();

    document.onclick = function(event) {
        inputElement.focus();
    };

    input.init({
        inputElement: inputElement,
        formElement: document.getElementById('input-form'),
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
});