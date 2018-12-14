import {IProgramDef} from './IProgramDef'
import {ICommandHandler} from '../ICommands'
// import {link as openLink} from '../util'

function link(href: string, text: string) {
  return '<a href="' + href + '" target="_blank">' + text + '</a>'
}

const sections: {[key: string]: string} = {
  contact: `
CONTACT INFO
============
Jerko Steiner
Zagreb, Croatia
You can contact me via:
 * ${link('http://github.com/jeremija', 'GitHub')}
 * ${link('http://www.linkedin.com/in/jerkosteiner', 'LinkedIn')}
 * ${link('http://plus.google.com/105805964399795379989/', 'Google+')}
`,

  work: `
WORK INFO
=========

2015 - present :: Software Developer at NYU LMC
  Working as a developer at Institute for Innovations in Medical Education.
  Took ownership of migrating existing codebase to Git, introduced continuous
  integration, automated deployment, and TDD. Currently developing a system for
  unified evaluation of medical students which should eventually spread across
  the whole university.


2014 - 2015 :: Lead Software Developer at Monolith
  Led development of a cloud solution which assisted retailers in making
  in-store decisions based on the combination of behavioral, demographic and
  sales data.  My work has directly contributed to the company\s ability to
  receive new investments, as well as €100k+ deals with companies such as Nike,
  Jaguar Land Rover, Timberland, and Scotch & Soda.

2011 - 2014 :: Senior Software Developer at PBZ, Gruppo Intesa
  Worked as a Software Developer in an Agile Development Team which developed
  an on-line banking platform used by over 300k users. This solution set the
  standard for the whole Intesa Sanpaolo Group. Daily work included writing and
  testing of service code, connecting to external services, developing a
  single-page Web Application, and creating modular and modern HTML/CSS
  layouts.

  Worked as a Software Developer on an on-line investment/stock trading web
  platform, used by over 10k users. The core was written in Java and had to be
  highly optimized for processing of many transactions in real-time. Daily work
  included working on service code which connected to external data sources and
  coding the front-end.
`,

  education: `
EDUCATION
=========
2009 - 2011
Master of Science in Electric Engineering and IT
University of Zagreb: ${link('http://www.fer.hr', 'FER')}

2006 - 2009
Bachelor of Science in Electric Engineering and IT
University of Zagreb: ${link('http://www.fer.hr', 'FER')}
`,

  skills: `
SKILLS
======
 * Coding:
     Java, JavaScript, Node.js, Python, Bash, C, C++, Android, Rust, Go
 * Databases:
     PostgreSQL, MySQL, SQLite, H2, Oracle Database, Mongo DB, InfluxDB
 * Web:
     HTML5, CSS3, SVG, Ajax, Streaming, WebSockets, Touch, OAuth2
 * Math:
     GNU Octave, MATLAB
 * Tools:
     Linux, Git, tmux, Vim, Zsh, fzf
 * Other:
     TDD, BDD, CI, Docker, OpenCV, Agile
`,

  personal: `
PERSONAL PROFILE
================
 * Excellent at time management and working against the clock
 * Detail-oriented
 * A quick learner who can work well under pressure
 * Keeps up to date with the latest technologies
 * Works well both in a team and independently
 * Enjoys educational opportunities to advance skills
 * Always willing to hear and discuss new ideas
 * Enjoys a competitive environment.
`,

  references: `
REFERENCES
==========
 * ${link('http://steiner.website', 'Steiner.website')}
 * ${link('http://github.com/jeremija', 'Github')}
`,
}

const help = `
  contact     Contact infog
  work        View work infog
  education   Educationg
  references  Referencesg
  skills      Skillsg
  personal    Personal profileg
  all         Prints all of the above informationg

  resume      Download resumeg

  clear       Clears the screeng
  help        Prints the choices againg
  exit        Exits interactive mode if in itg
`

export const about: IProgramDef = {
  commands: {
    // '': (p, args, argsMap) => {
    //   args.forEach(section => {
    //     p.output.print(sections[section])
    //   })
    // },
    ...Object.keys(sections)
    .reduce((o: {[key: string]: ICommandHandler}, key) => {
      o[key] = p => p.output.print(sections[key])
      return o
    }, {}),
    'all': p => {
      Object.keys(sections).forEach(section => {
        p.output.print(sections[section])
      })
    },
    '-h': p => p.output.print(help),
    '--help': p => p.output.print(help),
    'help': p => p.output.print(help),
    'exit': p => p.exit(),
  },
  options: {
    name: 'about',
    autoExit: true,
    prefix: 'about>',
  },
}
        // 'resume': function() {
        //     events.dispatch('link', 'data/steiner-resume.pdf'
        //     return true;
        // },
        // 'clear': function() {
        //     events.dispatch('output-clear'
        //     return true;
        // },
        // 'exit': function() {
        //     return false;
        // },
        // 'help': function() {
        //     printChoices(
        //     return true;
        // },
