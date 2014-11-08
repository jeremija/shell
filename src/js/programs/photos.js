define(['cli/Program', 'events/events', 'services/imgur'],
    function(Program, events, imgur)
{

    var albums = [{
        name: 'nyc',
        id: 'dYoql'
    }, {
        name: 'silba',
        id: 'utDaV'
    }, {
        name: 'tunisia',
        id: 'qsuyn'
    }, {
        name: 'nyc2',
        id: 'PU5zF'
    }, {
        name: 'amsterdam',
        id: 'shi1f'
    }, {
        name: 'nyc3',
        id: 'gToZU'
    }];

    function getDescription(image) {
        var title = image.title, description = image.description;
        if (title && description) return title + ': ' + description;
        if (title && !description) return title;
        if (!title && description) return description;
        return '';
    }

    function photoCallback(id) {
        exports.output('Loading...');
        imgur.getImages(id, function(err, album) {
            if (err) {
                exports.error('Error fetching image list: ' + err.message);
                return;
            }
            exports.output('Showing thumbnails for: ' + album.title);
            if (album.description) {
                exports.output('Description: ' + album.description);
            }
            var html = '';
            album.images.forEach(function(image) {
                var thumb = image.link.replace(/\.jpg$/, 's.jpg');
                var img = document.createElement('img');
                var parent = document.createElement('div');
                img.setAttribute('class', 'gallery');
                img.setAttribute('src', thumb);
                img.setAttribute('data-fullsrc', image.link || '');
                img.setAttribute('data-description', getDescription(image));
                parent.appendChild(img);
                html += parent.innerHTML;
            });
            exports.output(html);
        });
    }

    var exports = new Program({
        name: 'photos',
        defaultAction: function(args) {
            if (args) {
                return;
            }
            this.output('Usage:  photos [view] &lt;location&gt; [index]');
            this.output(' ');

            this.output('Available locations: \n' + albums.map(function(album) {
                return '  ' + album.name;
            }).join('\n') + '\n\n');
            this.output('Examples:');
            this.output('  show thumbnails from NYC:          photos nyc');
            this.output('  view full-size photos from NYC:    photos view nyc');
            this.output('  view third photo from NYC:         photos view nyc 3');
            this.output(' \nUse the [LEFT] and [RIGHT] keys to navigate' +
                'or press [ESC] key.');
        },
        args: {
            'view': function(name, index) {
                var albumId;
                albums.some(function(album) {
                    if (album.name === name) {
                        albumId = album.id;
                        return true;
                    }
                });

                if (!albumId) {
                    this.error('Invalid album name: "' + name + '"');
                    return;
                }
                exports.output('Loading...');
                imgur.getImages(albumId, function(err, album) {
                    if (err) {
                        exports.error('Error fetching image list: ' + err.message);
                        return;
                    }
                    exports.output('Done');
                    events.dispatch('photos', album.images.map(function(img) {
                        return {
                            link: img.link,
                            title: img.title,
                            description: img.description
                        };
                    }), index);
                });
            }
        }
    });

    function createPhotoCallback(loc) {
        return function(arg) {
            photoCallback(loc);
        };
    }

    albums.forEach(function(album) {
        exports.args[album.name] = createPhotoCallback(album.id);
    });
    // for (var loc in photos) {
    //     availableLocations += '  ' + loc + '\n';
    //     exports.args[loc] = createPhotoCallback(loc);
    // }

    return exports;

});