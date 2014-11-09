define(['cli/Program', 'services/soundcloud', 'events/events'],
    function(Program, sc, events)
{

    function isError(err) {
        if (err) {
            exports.error('Error connecting to SoundCloud: ' + err.message);
            return true;
        }
        return false;
    }

    function isInvalidIndex(index, array) {
        if (index >= array.length) {
            exports.error('Index out of bounds, max is ' + array.length);
            return true;
        }
        return false;
    }

    function embed(iframeHtml) {
        var dummy = document.createElement('div');
        var parent = document.createElement('div');
        dummy.appendChild(parent);
        parent.setAttribute('class', 'embedded-content soundcloud');
        parent.innerHTML = iframeHtml;
        exports.output(dummy.innerHTML);
    }

    var play = {
        playlist: function(index) {
            index--;
            sc.playlists(function(err, playlists) {
                if (isError(err)) return;
                if (isInvalidIndex(index, playlists)) return;
                var list = playlists[index];
                exports.output('Playing playlist "' + list.title + '"');
                sc.embed(list.permalink_url, {
                    auto_play: true,
                    maxheight: 300
                }, function(err, res) {
                    if (isError(err)) return;
                    embed(res.html);
                });
            });
        },
        track: function(index) {
            sc.tracks(function(err, tracks) {
                if (isError(err)) return;
                if (isInvalidIndex(index, tracks)) return;
                var track = tracks[index];
                exports.output('Playing track "' + track.title + '"');
                sc.embed(track.permalink_url, {
                    auto_play: true,
                    maxheight: 200
                }, function(err, res) {
                    if (isError(err)) return;
                    embed(res.html);
                });
            });
        }
    };

    var exports = new Program({
        name: 'soundcloud',
        defaultAction: function(args) {
            if (args) return;
            exports.output('This program plays my music from my SoundCloud ' +
                '<a href="https://soundcloud.com/jeremija" target="_blank">account</a>');
            exports.output('Usage: soundcloud &lt;command&gt; [index]');
            exports.output(' ');
            exports.output('where &lt;command&gt; is one of:');
            exports.output('  playlists              lists all playlists');
            exports.output('  tracks                 lists all tracks');
            exports.output('  play playlist &lt;index&gt;  plays the specific playlist');
            exports.output('  play track &lt;index&gt;     plays the specific track');
        },
        args: {
            'playlists': function() {
                sc.playlists(function(err, playlists) {
                    if (isError(err)) return;
                    exports.output('Found ' + playlists.length + ' playlists:');
                    exports.output(' ');
                    playlists.forEach(function(list, index) {
                        exports.output((index + 1) + '. ' + list.title +
                            ' (' + list.tracks.length + ' tracks)');
                    });
                    exports.output(' ');
                    exports.output('To play, type: soundcloud play playlist ' +
                        ' &lt;number&gt;');
                });
            },
            'tracks': function() {
                sc.tracks(function(err, tracks) {
                    if (isError(err)) return;
                    exports.output('Found ' + tracks.length + ' tracks:');
                    exports.output(' ');
                    tracks.forEach(function(track, index) {
                        exports.output((index + 1) + '. ' + track.title);
                    });
                    exports.output(' ');
                    exports.output('To play, type: soundcloud play track ' +
                        ' &lt;number&gt;');
                });
            },
            'play': function(what, index) {
                var len = arguments.length;
                if (len !== 2) {
                    exports.error('expected two arguments, got ' + len);
                    return;
                }
                if (what !== 'track' && what !== 'playlist') {
                    exports.error('first argument should be either \'track\'' +
                        ' or \'playlist\'');
                    return;
                }
                index = parseInt(index);
                if (isNaN(index) || index < 1) {
                    exports.error('Invalid index, should start from 1');
                    return;
                }
                play[what](index);
            },
            'profile': function() {
                events.dispatch('link', 'https://soundcloud.com/jeremija');
            }
        }
    });

    return exports;

});