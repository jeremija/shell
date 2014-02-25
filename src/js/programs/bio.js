define(['cli/Program'], function(Program) {

    var exports = new Program({
        name: 'bio',
        default: function() {
            this.ask({
                text: 'Who are you?',
                answers: ['jerko', 'kaja'],
                callback: function(answer) {
                    this.output('you answered ' + answer);
                    this.exit();
                }
            });
        },
        args: {}
    });

    return exports;

});