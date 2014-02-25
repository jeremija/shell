/**
 * Prints the help information for the user
 * @module programs/help
 */
define(['cli/Program'], function(Program) {

    var text =
        'This is a list of the most useful commands:\n' +
        '  exit  - exits an application (you cannot exit the main app)\n' +
        '  clear - clears the output\n' +
        '  help  - shows this text\n' +
        '  ls    - lists available programs\n' +
        ' \n' +
        'You use the [TAB] key to autocomplete entry\n' +
        'Most commands accept the standard --help argument for instructions, '+
        'For example: ls --help';

    var exports = new Program({
        name: 'help',
        default: function() {
            var texts = text.split('\n');

            for (var i in texts) {
                var txt = texts[i];
                this.output(txt);
            }
        }
    });

    return exports;

});