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
            exports.output(' ');

            exports.output('2014 - 2015 :: Lead Software Developer at Monolith');
            exports.output('  Leading developing of a cloud solution which assists retailers in making');
            exports.output('  in-store decisions based on the combination of behavioral, demographic and');
            exports.output('  sales data. My responsibilities include the choice of technologies, planning the');
            exports.output('  software architecture, ensuring that the software meets the design and');
            exports.output('  functionality specifications, writing code using behavior-driven development,');
            exports.output('  and delegation of duties to other developers. My work has directly contributed to');
            exports.output('  the company\'s ability to receive new investments, as well as work with companies');
            exports.output('  such as Nike, Jaguar Land Rover, Timberland, and Scotch & Soda.');
            exports.output(' ');
            exports.output('2014 - 2014 :: Senior Software Developer at PBZ, a bank of Intesa SanPaolo');
            exports.output('  Worked on R&D for a mobile application. Daily work involved ');
            exports.output('  behavior-driven development of mobile applications using Android SDK');
            exports.output('  and PhoneGap as a POC. PhoneGap applications relied on using a custom');
            exports.output('  highly-optimized JavaScript framework which resulted in a smoother');
            exports.output('  user experience. Also worked on development of RESTful APIs.');
            exports.output(' ');
            exports.output('2011 - 2014 :: Software Developer at PBZ, a bank of Intesa SanPaolo');

            exports.output('  Worked as a Software Developer in an Agile Development Team which developed');
            exports.output('  an on-line banking platform used by over 370k users. This solution set the');
            exports.output('  standard for the whole Intesa Sanpaolo Group. The daily work included');
            exports.output('  writing and testing of service code in Java, connecting to external');
            exports.output('  services, developing an in-house JavaScript framework, and creating modular');
            exports.output('  and modern HTML/CSS layouts.');
            exports.output(' ');
            exports.output('  Worked as a Software Developer on an on-line investment/stock trading web');
            exports.output('  platform, used by over 10k users. The core was written in Java and had to be');
            exports.output('  highly optimized for processing of many transactions in real-time. Daily work');
            exports.output('  included working on service code which connected to external data sources and');
            exports.output('  coding the front-end.');

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
            exports.output(' * ' + link('http://steiner.website', 'Steiner.website'));
            exports.output(' * ' + link('http://github.com/jeremija', 'Github'));
            exports.output(' * ' + link('http://mnlth.co', 'Monolith International BV'));
            exports.output(' * ' + link('http://cromedicor.com', 'CroMedicor'));
            exports.output(' * ' + link('http://www.linkedin.com/in/jerkosteiner', 'LinkedIn'));
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
