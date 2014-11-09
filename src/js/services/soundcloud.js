define(['services/ajax'], function(ajax) {
    var CLIENT_ID = '002eaf35d4b2ca43b25742d0b839d1f0',
        URL_EMBED = 'http://soundcloud.com/oembed',
        API = 'https://api.soundcloud.com';

    function api(url) {
        return API + url + '?client_id=' + CLIENT_ID;
    }

    var URL_PLAYLISTS = api('/users/jeremija/playlists.json'),
        URL_TRACKS = api('/users/jeremija/tracks.json');

    function parse(json) {
        try {
            return JSON.parse(json);
        }
        catch(e) {
            return json;
        }
    }

    function cbJson(callback) {
        return function(err, res) {
            if (err) callback(err);
            else callback(undefined, parse(res));
        };
    }

    var exports = {
        url: function(url) {
            return url + '?client_id=' + CLIENT_ID;
        },
        embed: function(url, config, callback) {
            var cfg = {
                body: {
                    format: 'json',
                    url: url,
                    auto_play: !!config.auto_play,
                    // maxwidth: 450,
                    maxheight: config.maxheight,
                }
            };
            ajax.post(URL_EMBED, cfg, cbJson(callback));
        },
        playlists: function(callback) {
            ajax.get(URL_PLAYLISTS, {}, cbJson(callback));
        },
        tracks: function(callback) {
            ajax.get(URL_TRACKS, {}, cbJson(callback));
        }
    };

    return exports;

});