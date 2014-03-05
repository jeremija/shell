define(['gui/photoViewer', 'events/events'], function(photoViewer, events) {

    describe('test/js/gui/photoViewer-test.js', function() {

        var div, img1, img2, img3, listener;
        var viewerElement;
        before(function() {
            listener = document.createElement('div');

            div = document.createElement('div');
            img1 = document.createElement('img');
            img2 = document.createElement('img');
            img3 = document.createElement('img');

            div.attachChild(img1);
            div.attachChild(img2);
            div.attachChild(img3);

            listener.appendChild(div);

            document.getElementById('test').appendChild(listener);
        });

        after(function() {
            events.clear();
        });

        it('should be an object', function() {
            expect(events).to.be.an('object');
        });
        describe('init()', function() {
            it('should be a function', function() {
                expect(photoViewer.init).to.be.a('function');
            });
            it('should initialize photoViewer', function() {
                photoViewer.init();

                expect()
            });
        });
        describe('show()')
    });

});