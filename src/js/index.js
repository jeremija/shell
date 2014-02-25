define(['cli/input', 'cli/output', 'cli/tasks',
    'programs/defaultShell', 'programs/all', 'events/link'],
    function(input, output, tasks, defaultShell, allPrograms, link) {

    window.onblur = function() {
        document.getElementById('cursor').className = 'hidden';
    };

    window.onfocus = function() {
        document.getElementById('cursor').className = '';
    };

    var realInput = document.getElementById('real-input');
    realInput.focus();

    document.onclick = function(event) {
        event.preventDefault();
        realInput.focus();
    }

    input.init({
        listenElement: realInput,
        prefixElement: document.getElementById('input-prefix'),
        displayElement: document.getElementById('input-display')
    });
    output.init(document.getElementById('console-output'));

    defaultShell.init();
    for (var i in allPrograms) {
        var program = allPrograms[i];
        defaultShell.registerProgram(program);
    }

    tasks.init({
        shell: defaultShell
    });

});