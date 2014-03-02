define(['cli/Program', 'events/events'], function(Program, events) {

    var selectedPhotos;
    var captions = {
        nyc: 'Showing photos from New York City, NY',
        silba: 'Showing protos from Silba, Croatia',
        tunisia: 'Showing protos from Tunisia'
    };
    var photos = {
        nyc: [
            'photos/nyc/1.jpg',
            'photos/nyc/2.jpg',
            'photos/nyc/3.jpg',
            'photos/nyc/4.jpg',
            'photos/nyc/5.jpg',
            'photos/nyc/6.jpg',
            'photos/nyc/7.jpg',
            'photos/nyc/8.jpg',
            'photos/nyc/9.jpg',
            'photos/nyc/10.jpg',
            'photos/nyc/11.jpg',
        ],
        silba: [
            'photos/silba/1.jpg',
            'photos/silba/2.jpg',
            'photos/silba/3.jpg',
            'photos/silba/4.jpg',
            'photos/silba/5.jpg',
            'photos/silba/6.jpg'
        ],
        tunisia: [
            'photos/tunisia/1.jpg',
            'photos/tunisia/2.jpg',
            'photos/tunisia/3.jpg',
            'photos/tunisia/4.jpg',
            'photos/tunisia/5.jpg',
            'photos/tunisia/6.jpg',
            'photos/tunisia/7.jpg',
            'photos/tunisia/8.jpg',
            'photos/tunisia/9.jpg',
            'photos/tunisia/10.jpg',
            'photos/tunisia/11.jpg',
            'photos/tunisia/12.jpg',
            'photos/tunisia/13.jpg',
            'photos/tunisia/14.jpg',
            'photos/tunisia/15.jpg',
            'photos/tunisia/16.jpg',
            'photos/tunisia/17.jpg',
            'photos/tunisia/18.jpg',
            'photos/tunisia/19.jpg'
        ]
    };

    function photoCallback(location) {
        photoIndex = 0;
        selectedPhotos = photos[location];

        var html = '';
        selectedPhotos.forEach(function(photo) {
            html += '<img src="' + photo + '"/>';
        });
        exports.output(captions[location]);
        exports.output(html);
        // exports.exit();
        askMain();
    }

    function askMain() {
        exports.ask({
            text: 'Which photos would you like to see?',
            answers: ['nyc', 'silba', 'tunisia'],
            callback: photoCallback
        });
    }

    var exports = new Program({
        name: 'photos',
        default: function(args) {
            if (args) {
                return;
            }
            askMain();
        },
        args: {
            '--help': function() {
                this.output('photos: displays some of the pictures i took');
            },
            'nyc': function() {
                photoCallback('nyc');
            },
            'silba': function() {
                photoCallback('silba');
            },
            'tunisia': function() {
                photoCallback('tunisia');
            }
        }
    });

    return exports;

});