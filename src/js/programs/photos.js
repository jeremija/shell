define(['cli/Program', 'events/events', 'services/imgur', 'services/ajax'],
    function(Program, events, imgur, ajax)
{

    function getAlbums(callback) {
        ajax.json('data/albums.json', {}, function(err, albums) {
            if (err) {
                exports.error('Error loading photos list: ' + err.message);
                return;
            }
            callback(undefined, albums);
        });
    }

    function getDescription(image) {
        var title = image.title, description = image.description;
        if (title && description) return title + ': ' + description;
        if (title && !description) return title;
        if (!title && description) return description;
        return '';
    }

    function showThumbnails(id) {
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

    function openGallery(albums, name, index) {
        var albumId = albums[albums.map(function(album) {
            return album.name;
        }).indexOf(albumId)];
        albums.some(function(album) {
            if (album.name === name) {
                albumId = album.id;
                return true;
            }
        });

        if (!albumId) {
            exports.error('Invalid album name: "' + name + '"');
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
                    description: getDescription(img)
                };
            }), index);
        });
    }

    var exports = new Program({
        name: 'photos',
        defaultAction: function(args) {
            if (args == 'test') this.output('test bla');
            if (args) return;
            this.output('Usage:  photos &lt;view|thumbs|list&gt; [location] [index]');
            this.output(' ');
            this.output('  list           shows a list of available albums');
            this.output('  thumbs         shows album thumbnails');
            this.output('  view           opens album gallery');
            this.output(' ');
            this.output('Examples:');
            this.output('  show thumbnails from NYC:          photos thumbs nyc');
            this.output('  view full-size photos from NYC:    photos view nyc');
            this.output('  view third photo from NYC:         photos view nyc 3');
            this.output(' \nUse the [LEFT] and [RIGHT] keys to navigate' +
                'or press [ESC] key.');
        },
        args: {
            'list': function() {
                getAlbums(function(err, albums) {
                    if (err) return;
                    exports.output('Available albums:');
                    exports.output(' ');
                    albums.forEach(function(album) {
                        exports.output('  ' + album.name);
                    });
                    exports.output(' ');
                    exports.output('To show thumbnails type: photos thumbs &lt;album&gt;');
                    exports.output('To view full images type: photos view &lt;album&gt;');
                });
            },
            'thumbs': function(name) {
                getAlbums(function(err, albums) {
                    if (err) return;
                    var index = albums.map(function(album) {
                        return album.name;
                    }).indexOf(name);
                    if (index < 0) {
                        exports.error('No albums found with that name');
                        exports.error('Type "photos list" to see available albums');
                        return;
                    }
                    showThumbnails(albums[index].id);
                });
            },
            'view': function(name, index) {
                getAlbums(function(err, albums) {
                    openGallery(albums, name, index);
                });
            }
        }
    });

    return exports;

});