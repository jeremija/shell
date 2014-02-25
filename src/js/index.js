define(['cli/input', 'cli/output', 'cli/tasks',
    'programs/defaultShell', 'programs/all'],
    function(input, output, tasks, defaultShell, allPrograms) {

    window.onblur = function() {
        document.getElementById('cursor').className = 'hidden';
    };

    window.onfocus = function() {
        document.getElementById('cursor').className = '';
    };

    input.init({
        listenElement: document,
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