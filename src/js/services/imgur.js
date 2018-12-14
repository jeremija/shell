define(['services/ajax'], function(ajax) {

    var IMGUR_CLIENT_ID = 'Client-ID 684f62d6487d2e0',
        IMGUR_ALBUM_URL = 'https://api.imgur.com/3/album/';

    var exports = {
        getImages: function(albumId, callback) {
            var cfg = {
                headers: {
                    'Authorization': IMGUR_CLIENT_ID
                }
            };
            ajax.json(IMGUR_ALBUM_URL + albumId, cfg, function(err, response) {
                if (err) {
                    callback(err);
                    return;
                }
                var protocol = window.location.protocol;
                response.data.images.forEach(function(image) {
                    image.link = image.link.replace('http:', protocol);
                });
                callback(undefined, response.data);
            });
        },
        // get: function() {
        //     this.getImages('PU5zF', function(err, album) {
        //         console.log(err, album);
        //     });
        // }
    };

    return exports;

});
