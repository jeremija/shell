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

            exports.output('2015 - present :: Software Developer at NYU LMC');
            exports.output('  Working as a developer at Institute for Innovations in Medical Education. Took');
            exports.output('  ownership of migrating existing codebase to Git, introduced continuous integration,');
            exports.output('  automated deployment, and TDD. Currently developing a system for unified evaluation');
            exports.output('  of medical students which should eventually spread across the whole university.');
            exports.output(' ');

            exports.output('2014 - 2015 :: Lead Software Developer at Monolith');
            exports.output('  Led development of a cloud solution which assisted retailers in making in-store');
            exports.output('  decisions based on the combination of behavioral, demographic and sales data.');
            exports.output('  My work has directly contributed to the company\'s ability to receive new');
            exports.output('  investments, as well as €100k+ deals with companies such as Nike, Jaguar Land Rover,');
            exports.output('  Timberland, and Scotch & Soda.');
            exports.output(' ');
            exports.output('2011 - 2014 :: Senior Software Developer at PBZ, Gruppo Intesa');
            exports.output('  Worked as a Software Developer in an Agile Development Team which developed an');
            exports.output('  on-line banking platform used by over 300k users. This solution set the standard for');
            exports.output('  the whole Intesa Sanpaolo Group. Daily work included writing and testing of service');
            exports.output('  code, connecting to external services, developing a single-page Web Application, and');
            exports.output('  creating modular and modern HTML/CSS layouts.');
            exports.output(' ');
            exports.output('  Worked as a Software Developer on an on-line investment/stock trading web platform,');
            exports.output('  used by over 10k users. The core was written in Java and had to be highly optimized');
            exports.output('  for processing of many transactions in real-time. Daily work included working on');
            exports.output('  service code which connected to external data sources and coding the front-end.');

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
            exports.output(' * Coding:');
            exports.output('     Java, JavaScript, Node.js, Python, Bash, C, C++, Android, Rust, Go');
            exports.output(' * Databases:');
            exports.output('     PostgreSQL, MySQL, SQLite, H2, Oracle Database, Mongo DB, InfluxDB');
            exports.output(' * Web:');
            exports.output('     HTML5, CSS3, SVG, Ajax, Streaming, WebSockets, Touch, OAuth2');
            exports.output(' * Math:');
            exports.output('     GNU Octave, MATLAB');
            exports.output(' * Tools:');
            exports.output('     Linux, Git, tmux, Vim, Zsh, fzf');
            exports.output(' * Other:');
            exports.output('     TDD, BDD, CI, Docker, OpenCV, Agile');
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
            exports.output(' * ' + link('http://steiner.website', 'Steiner.website'));
            exports.output(' * ' + link('http://github.com/jeremija', 'Github'));
            return true;
        },
        'all': function() {
            exports.output(' ');

            handlers.contact();
            exports.output(' ');

            handlers.work();
            exports.output(' ');

            handlers.education();
            exports.output(' ');

            handlers.skills();
            exports.output(' ');

            handlers.personal();
            exports.output(' ');

            handlers.references();
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
        exports.output('  exit        Exits interactive mode if in it');
    }

    function askForChoice() {

        exports.ask({
            text: '',
            answers: answers,
            callback: callback
        });
    }

    var allArgs = {
        '--help': function() {
            this.output('This program outputs various information ' +
                'about the author.');
            this.output('usage: about [--help] [--interactive] &lt;[command]&gt;');
            this.output(' ');
            this.output('  --interactive    ask for choices');
            this.output('  --help           prints help message');
            this.output(' ');
            this.output('You can also directly type about &lt;command&gt;.');
            this.output('Here is a list of available commands:');
            printChoices();
            this.output(' ');
            this.output('For example: about work');
        },
        '--interactive': function() {
            printChoices();
            askForChoice();
        }
    };

    for(var key in handlers) {
        allArgs[key] = handlers[key];
    }

    var exports = new Program({
        name: 'about',
        defaultAction: function(args) {
            if (args) {
                return;
            }
            allArgs['--help'].call(this);
            // this.output('This program outputs various information about the author.');

            // printChoices();
            // askForChoice();
        },
        args: allArgs
    });

    return exports;

});
