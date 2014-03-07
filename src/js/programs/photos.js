define(['cli/Program', 'events/events'], function(Program, events) {

    var selectedPhotos;
    var captions = {
        nyc: 'Showing photos from New York City, NY:',
        silba: 'Showing protos from Silba, Croatia:',
        tunisia: 'Showing protos from Tunisia:'
    };
    var photos = {
        nyc: [
            'http://i.imgur.com/6bHtDgd.jpg',
            'http://i.imgur.com/H1y3EsC.jpg',
            'http://i.imgur.com/qPJD9ht.jpg',
            'http://i.imgur.com/Yd9B64R.jpg',
            'http://i.imgur.com/K1EDMEI.jpg',
            'http://i.imgur.com/02znykO.jpg',
            'http://i.imgur.com/bqpiE5f.jpg',
            'http://i.imgur.com/r77aTGI.jpg',
            'http://i.imgur.com/vwn1cdh.jpg',
            'http://i.imgur.com/PlYaUnJ.jpg',
            'http://i.imgur.com/x4nShMR.jpg'
        ],
        silba: [
            'http://i.imgur.com/HlurWrC.jpg',
            'http://i.imgur.com/TyGODsX.jpg',
            'http://i.imgur.com/0X5QmLK.jpg',
            'http://i.imgur.com/TPFAtiy.jpg',
            'http://i.imgur.com/kNt2vh5.jpg',
            'http://i.imgur.com/o1puZwg.jpg',
            'http://i.imgur.com/J32FJP8.jpg',
            'http://i.imgur.com/L722gLl.jpg',
            'http://i.imgur.com/AKcy6kx.jpg',
            'http://i.imgur.com/UNuQwH5.jpg',
            'http://i.imgur.com/3oLFZMm.jpg',
            'http://i.imgur.com/ak7sIfO.jpg',
            'http://i.imgur.com/ZPauQ6f.jpg',
            'http://i.imgur.com/FGW0upS.jpg',
            'http://i.imgur.com/sLQpHe7.jpg',
            'http://i.imgur.com/rn0VwPz.jpg',
            'http://i.imgur.com/tDITX4b.jpg',
            'http://i.imgur.com/j0KNaxa.jpg',
            'http://i.imgur.com/UeuBje8.jpg'
        ],
        tunisia: [
            'http://i.imgur.com/AduckKS.jpg',
            'http://i.imgur.com/HVzCwZt.jpg',
            'http://i.imgur.com/Xo2ZJVV.jpg',
            'http://i.imgur.com/lTJxVs9.jpg',
            'http://i.imgur.com/s0ZA7EO.jpg',
            'http://i.imgur.com/J70oxqd.jpg',
            'http://i.imgur.com/5lPKIWn.jpg',
            'http://i.imgur.com/KyUxPXe.jpg',
            'http://i.imgur.com/JLnnwwd.jpg',
            'http://i.imgur.com/XM6fSBC.jpg',
            'http://i.imgur.com/2pTACT4.jpg',
            'http://i.imgur.com/vLl4GgV.jpg',
            'http://i.imgur.com/o7rCsC9.jpg',
            'http://i.imgur.com/KQZ3fWs.jpg',
            'http://i.imgur.com/7CCfN5q.jpg',
            'http://i.imgur.com/AYWcYFm.jpg',
            'http://i.imgur.com/3P6Dfpx.jpg',
            'http://i.imgur.com/3GiCBso.jpg',
            'http://i.imgur.com/UN2c90T.jpg',
            'http://i.imgur.com/ICAKFQR.jpg'
        ]
    };

    function photoCallback(location) {
        photoIndex = 0;
        selectedPhotos = photos[location];

        var html = '';
        selectedPhotos.forEach(function(photo) {
            var thumb = photo.replace(/\.jpg$/, 's.jpg');
            html += '<img class="gallery" src="' + thumb + '"' +
                'data-fullsrc="' + photo + '" />';
        });
        exports.output(captions[location]);
        exports.output(html);
    }

    var exports = new Program({
        name: 'photos',
        defaultAction: function(args) {
            if (args) {
                return;
            }
            this.output('Usage:  photos [view] &lt;location&gt;');
            this.output(' ');

            this.output('Available locations: \n' +
                availableLocations + '\n');
            this.output('Examples:');
            this.output('  show thumbnails from NYC:          photos nyc');
            this.output('  view full-size photos from NYC:    photos view nyc');
            this.output(' \nUse the [LEFT] and [RIGHT] keys to navigate' +
                'or press [ESC] key.');
        },
        args: {
            'view': function(location){
                var photosArray = photos[location];
                if (!photosArray) {
                    this.error('Invalid location: "' + location + '"');
                    return;
                }
                events.dispatch('photos', photosArray);
            }
        }
    });

    function createPhotoCallback(loc) {
        return function(arg) {
            photoCallback(loc);
        };
    }
    var availableLocations = '';
    for (var loc in photos) {
        availableLocations += '  ' + loc + '\n';
        exports.args[loc] = createPhotoCallback(loc);
    }

    return exports;

});