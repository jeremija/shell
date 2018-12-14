define(['events/html', 'services/soundcloud'], function(htmlEvents, sc) {

    var playlist = [],
        index = 0;

    function isArray(arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    }

    var audio;

    function createAudio(url) {
        if (audio) {
            audio.pause();
            htmlEvents.removeListener(audio, 'ended', onEnd);
        }
        if (!window.hasOwnProperty('Audio')) return;
        audio = new Audio(sc.url(url));
        htmlEvents.addListener(audio, 'ended', onEnd);
    }

    function onEnd() {
        exports.next();
    }

    var exports = {
        playlist: function(list) {
            if (!arguments.length) return playlist;
            if (!isArray(list)) list = [];
            playlist = list;
            index = 0;
            return this;
        },
        status: function() {
            var track = playlist[index];
            var duration = audio ? audio.duration : 0;
            var currentTime = audio ? audio.currentTime : 0;
            return {
                current: index + 1,
                index: index,
                total: playlist.length,
                playlist: playlist,
                percent: Math.round((currentTime / duration * 100)),
                title: track && track.title,
                status: audio ? (audio.paused ? 'idle' : 'playing') : 'idle'
            };
        },
        previous: function() {
            var i = --index;
            if (i < 0) i = 0;
            var track = playlist[index];
            if (!track) return this;
            createAudio(track.stream_url);
            if (audio) audio.play();
            return this;
        },
        play: function() {
            if (audio) {
                audio.play();
            }
            return this;
        },
        pause: function() {
            if (audio && audio.paused) audio.play();
            else if (audio) audio.pause();
            return this;
        },
        next: function(i) {
            if (!arguments.length) i = ++index;
            if (i >= playlist.length) {
                index = 0;
                return this;
            }
            var track = playlist[i];
            index = i;
            createAudio(track.stream_url);
            if (audio) audio.play();
        },
        stop: function() {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
            return this;
        },
        seek: function(percent) {
            if (!audio || audio.paused) return this;
            var seekTime = audio.duration * percent / 100;
            audio.currentTime = seekTime;
        }
    };

    return exports;

});
