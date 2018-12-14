define(['cli/Program', 'services/soundcloud', 'events/events', 'services/audio'],
    function(Program, sc, events, audio)
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

    var open = {
        playlist: function(index) {
            index--;
            sc.playlists(function(err, playlists) {
                if (isError(err)) return;
                if (isInvalidIndex(index, playlists)) return;
                var list = playlists[index];
                exports.output('Playing playlist: ' + list.title);
                exports.output('Playing track: ' + list.tracks[0].title);
                audio.playlist(list.tracks).next(0);
                exports.output('If you are on a mobile device, you might ' +
                    'have to type "music play" for this to work');
                exports.output('Type "music status" to see more info');
                // sc.embed(list.permalink_url, {
                //     auto_play: true,
                //     maxheight: 300
                // }, function(err, res) {
                //     if (isError(err)) return;
                //     embed(res.html);
                // });
            });
        },
        track: function(index) {
            index--;
            sc.tracks(function(err, tracks) {
                if (isError(err)) return;
                if (isInvalidIndex(index, tracks)) return;
                var track = tracks[index];
                exports.output('Playing single track: ' + track.title);
                audio.playlist([track]).next(0);
                exports.output('If you are on a mobile device, you might ' +
                    'have to type "music play" for this to work');
                exports.output('Type "music status" to see more info');
                // sc.embed(track.permalink_url, {
                //     auto_play: true,
                //     maxheight: 200
                // }, function(err, res) {
                //     if (isError(err)) return;
                //     embed(res.html);
                // });
            });
        }
    };

    function drawProgressBar(percent) {
        var count = 20;
        var current = percent / 100 * count;
        var progress = '[';
        var first = true;
        for(var i = 0; i < count; i++) {
            if (current > i) progress += '=';
            else if (first) {
                progress += '>';
                first = false;
            }
            else progress += ' ';
        }
        exports.output(progress + ']');
    }

    var exports = new Program({
        name: 'music',
        defaultAction: function(args) {
            if (args) return;
            exports.output('This program plays my music from my SoundCloud ' +
                '<a href="https://soundcloud.com/jeremija" target="_blank">account</a>');
            exports.output('Usage: music &lt;command&gt; [index]');
            exports.output(' ');
            exports.output('where &lt;command&gt; is one of:');
            exports.output('  playlists              lists all playlists');
            exports.output('  tracks                 lists all tracks');
            exports.output('  status                 prints playback status');
            exports.output(' ');
            exports.output('  next                   skips to next track');
            exports.output('  next &lt;index&gt;           skips to a track defined by index');
            exports.output('  open playlist &lt;index&gt;  loads and plays the specific playlist');
            exports.output('  open track &lt;index&gt;     loads and plays the specific track');
            exports.output('  pause                  pauses the playback');
            exports.output('  play                   starts the playback. Note that a track');
            exports.output('                         or a playlist needs to be loaded first');
            exports.output('  previous               skips to previous track');
            exports.output('  profile                opens my SoundCloud profile');
            exports.output('  stop                   stops the playback');
            exports.output('  seek &lt;percent&gt;         seeks to percent');
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
                    exports.output('To play, type: music open playlist ' +
                        '&lt;number&gt;');
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
                    exports.output('To play, type: music open track ' +
                        '&lt;number&gt;');
                });
            },
            'open': function(what, index) {
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
                open[what](index);
            },
            'play': function() {
                if (!audio.status().total) {
                    exports.error('Cannot play, no playlist set.');
                    return;
                }
                audio.play();
                return;
            },
            'pause': function() {
                audio.pause();
            },
            'stop': function() {
                audio.stop();
            },
            'next': function(index) {
                if (arguments.length) {
                    index = parseInt(index) - 1;
                    if (isNaN(index)) {
                        exports.error('Invalid parameter, expected an integer');
                        return;
                    }
                    audio.next(index);
                }
                else audio.next();
                var status = audio.status();
                if (status.title)
                    exports.output('Playing ' + audio.status().title);
                else
                    exports.output('No next track');
            },
            'previous': function() {
                audio.previous();
                var status = audio.status();
                if (status.title)
                    exports.output('Playing ' + audio.status().title);
                else
                    exports.output('No previous track');
            },
            'seek': function(percent) {
                if (!arguments.length) {
                    exports.error('Expected seek percent argument');
                    return;
                }
                percent = parseInt(percent);
                if (isNaN(percent) || percent < 0 || percent > 100) {
                    exports.error('Seek argument should be between 0 and 100');
                    return;
                }
                audio.seek(percent);
            },
            'status': function() {
                var status = audio.status();
                exports.output('Playback status: ' + status.status);
                exports.output('Current track: ' +
                    (status.title ? status.current + '. ' + status.title :
                        '&lt;not set&gt;'));
                if (!isNaN(status.percent)) {
                    drawProgressBar(status.percent);
                }
                if (status.total) {
                    exports.output(' ');
                    status.playlist.forEach(function(track, index) {
                        var prefix = status.index === index ? ' =&gt; ':'    ';
                        var text = prefix + (index + 1) + '. ' + track.title;
                        exports.output(text);
                    });
                    exports.output(' ');
                    exports.output('Total ' + status.total + ' tracks');
                }
                else {
                    exports.output('No playlist set');
                }
            },
            'profile': function() {
                events.dispatch('link', 'https://soundcloud.com/jeremija');
            }
        }
    });

    return exports;

});
