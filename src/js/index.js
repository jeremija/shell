require(['cli/input', 'cli/output', 'cli/tasks',
    'programs/defaultShell', 'programs/all', 'events/link'],
    function(input, output, tasks, defaultShell, allPrograms, link) {

    link.init();

    var inputElement = document.getElementById('input');
    inputElement.focus();

    document.onclick = function(event) {
        inputElement.focus();
    };

    input.init({
        inputElement: inputElement,
        formElement: document.getElementById('input-form'),
        prefixElement: document.getElementById('input-prefix'),
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