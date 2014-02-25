define(['cli/Program', 'events/events'], function(Program, events) {

    function link(href, text) {
        return '<a href="' + href + '" target="_blank">' + text + '</a>';
    }

    handlers = {
        'contact': function() {
            exports.output('CONTACT INFO');
            exports.output('============');
            exports.output('Jerko Steiner');
            exports.output('Zagreb, Croatia');
            exports.output('You can contact me via:');
            exports.output(' * ' + link('http://github.com/jeremija', 'GitHub'));
            exports.output(' * ' + link('http://www.linkedin.com/in/jerkosteiner', 'LinkedIn'));
            exports.output(' * ' + link('http://plus.google.com/105805964399795379989/', 'Google+'));
            return true;
        },
        'work': function() {
            exports.output('WORK INFO');
            exports.output('=========');
            exports.output('2011 - present');
            exports.output('Privredna Banka Zagreb, a bank of Intesa SanPaolo');
            exports.output(' * Lead developer of a mobile application for locating');
            exports.output('   nearby ATMs and offices.');
            exports.output(' ');
            exports.output(' * Development of an on-line banking solution');
            exports.output('   Technologies used: Java EE, Spring, JavaScript, jQuery,');
            exports.output('   Knockout.js, Require.js, Bootstrap, Mocha');
            exports.output(' ');
            exports.output(' * Development of a web platform for trading derivatives');
            exports.output('   Technologies used: Java EE, Oracle DB,');
            exports.output('   Spring, Hibernate, Flex, JavaScript, WebSphere');
            return true;
        },
        'education': function() {
            exports.output('EDUCATION');
            exports.output('=========');
            exports.output('2009 - 2011');
            exports.output('Master of Science in Electric Engineering and IT');
            exports.output('University of Zagreb: ' + link('http://www.fer.hr', 'FER'));
            exports.output(' ');
            exports.output('2006 - 2009');
            exports.output('Bachelor of Science in Electric Engineering and IT');
            exports.output('University of Zagreb: ' + link('http://www.fer.hr', 'FER'));
            return true;
        },
        'skills': function() {
            exports.output('SKILLS');
            exports.output('======');
            exports.output(' * Operating systems:');
            exports.output('     Linux, Windows, Unix');
            exports.output(' * Programming:');
            exports.output('     Java EE, Android, JavaScript, Python, C, Flex, PHP');
            exports.output(' * Databases:');
            exports.output('     Oracle, MongoDB, MySQL, MS SQL');
            exports.output(' * Application servers:');
            exports.output('     Node.js, Tomcat, WebSphere, Apache');
            exports.output(' * Web technologies:');
            exports.output('     HTML5, CSS3, XML, WebAPI, Socket.io, REST');
            exports.output(' * Source code management:');
            exports.output('     Git, Subversion, CVS');
            exports.output(' * Behavior-driven development, TDD');
            exports.output(' * Ability to break down a program\'s logic into smaller');
            exports.output('   reusable and testable sub-modules.');
            return true;
        },
        'personal': function() {
            exports.output('PERSONAL PROFILE');
            exports.output('================');
            exports.output(' * Excellent at time management and working against the clock');
            exports.output(' * Detail-oriented');
            exports.output(' * A quick learner who can work well under pressure');
            exports.output(' * Keeps up to date with the latest technologies');
            exports.output(' * Works well both in a team and independently');
            exports.output(' * Enjoys educational opportunities to advance skills');
            exports.output(' * Always willing to hear and discuss new ideas');
            exports.output(' * Enjoys a competitive environment.');
            return true;
        },
        'references': function() {
            exports.output('REFERENCES');
            exports.output('==========');
            exports.output(' * ' + link('http://steinerize.com/snake', 'Snake'));
            exports.output(' * ' + link('http://github.com/jeremija', 'Github'));
            exports.output(' * ' + link('http://cromedicor.com', 'CroMedicor'));
            exports.output(' * ' + link('http://www.linkedin.com/in/jerkosteiner', 'LinkedIn'));
            return true;
        },
        'all': function() {
            exports.output(' ');

            this.contact();
            exports.output(' ');

            this.work();
            exports.output(' ');

            this.education();
            exports.output(' ');

            this.skills();
            exports.output(' ');

            this.personal();
            exports.output(' ');

            this.references();
            exports.output(' ');

            return true;
        },
        'resume': function() {
            events.dispatch('link', 'data/steiner-resume.pdf');
            return true;
        },
        'clear': function() {
            events.dispatch('output-clear');
            return true;
        },
        'exit': function() {
            return false;
        },
        'help': function() {
            printChoices();
            return true;
        },
    };

    var answers = [];

    for (var answer in handlers) {
        answers.push(answer);
    }

    function callback(choice) {
        var handler = handlers[choice];
        if (!handler) {
            exports.error('invalid choice');
            return;
        }
        if (!handler.call(handlers)) {
            exports.output('bye!');
            exports.exit();
        }
        askForChoice();
    }

    function printChoices() {
        exports.output('  contact     Contact info');
        exports.output('  work        View work info');
        exports.output('  education   Education');
        exports.output('  references  References');
        exports.output('  skills      Skills');
        exports.output('  personal    Personal profile');
        exports.output('  all         Prints all of the above information');
        exports.output(' ');
        exports.output('  resume      Download resume');
        exports.output(' ');
        exports.output('  clear       Clears the screen');
        exports.output('  help        Prints the choices again');
        exports.output('  exit        Exits the program');
    }

    function askForChoice() {

        exports.ask({
            text: '',
            answers: answers,
            callback: callback
        });
    }

    var exports = new Program({
        name: 'about',
        default: function(args) {
            if (args) {
                return;
            }
            this.output('This program outputs various information about the author.');

            printChoices();
            askForChoice();
        },
        args: {
            '--help': function() {
                this.output('about: This program outputs various information ' +
                    'about the author.');
            }
        }
    });

    return exports;

});