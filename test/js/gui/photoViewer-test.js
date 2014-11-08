define(['gui/photoViewer', 'events/events'], function(photoViewer, events) {

    describe('test/js/gui/photoViewer-test.js', function() {

        var div, img1, img2, img3, listener;
        var viewerElement, imgElement;

        function fakeKeyDown(obj, keyCode) {
            var e = document.createEvent('Event');
            e.initEvent('keydown', true, true);
            e.keyCode = keyCode;
            obj.dispatchEvent(e);
        }

        function triggerEvent(obj, name) {
            var e = document.createEvent('Event');
            e.initEvent(name, true, true);
            obj.dispatchEvent(e);
        }

        before(function() {
            listener = document.createElement('div');

            div = document.createElement('div');
            img1 = document.createElement('img');
            img1.setAttribute('data-fullsrc', 'image1.jpg');
            img2 = document.createElement('img');
            img2.setAttribute('data-fullsrc', 'image2.jpg');
            img3 = document.createElement('img');
            img3.setAttribute('data-fullsrc', 'image3.jpg');

            div.appendChild(img1);
            div.appendChild(img2);
            div.appendChild(img3);

            listener.appendChild(div);

            document.getElementById('test').appendChild(listener);

            viewerElement = document.createElement('div');
        });

        after(function() {
            document.getElementById('test').innerHTML = '';
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
                photoViewer.init(viewerElement, listener);

                expect(photoViewer._viewerElement).to.be(viewerElement);
                expect(photoViewer._listenElement).to.be(listener);
                expect(photoViewer._imgElement.tagName).to.be('IMG');

                imgElement = photoViewer._imgElement;

                expect(viewerElement.className).to.be('invisible');
            });
            it('should start listening to `photos` event', function() {
                expect(events._listeners.photos.length).to.be(1);
                expect(events._listeners.photos[0].callback).to.be(
                    photoViewer._onPhotos);
            });
            it('should have navigation toolbar', function() {
                var nav =
                    viewerElement.getElementsByClassName('photo-viewer-nav')[0];
                expect(nav).to.be.ok();
                expect(nav.tagName).to.be('DIV');

                var as = nav.getElementsByTagName('a');
                expect(as.length).to.be(4);

                expect(as[0].className).to.be('nav-left');
                expect(as[0].onclick).to.be(photoViewer.previous);
                expect(as[1].className).to.be('nav-close');
                expect(as[1].onclick).to.be(photoViewer.close);
                expect(as[2].className).to.be('nav-full');
                expect(as[2].onclick).to.be(photoViewer.fullscreen);
                expect(as[3].className).to.be('nav-right');
                expect(as[3].onclick).to.be(photoViewer.next);
            });
        });
        describe('listener click', function() {
            var inputDisabled;
            function onDisable() {
                inputDisabled = true;
            }
            before(function() {
                events.listen('input-disable', onDisable);
            });
            after(function() {
                events.unlisten('input-disable', onDisable);
            });
            it('should do nothing if not clicked on IMG', function() {
                triggerEvent(listener, 'click');
                expect(photoViewer.data.index).to.be.lessThan(0);
            });
            it('should set data.index and data.urls if IMG', function() {
                triggerEvent(img2, 'click');
                var data = photoViewer.data;

                expect(data.index).to.be(1);
                expect(data.urls.length).to.be(3);

                expect(data.urls[0]).to.be('image1.jpg');
                expect(data.urls[1]).to.be('image2.jpg');
                expect(data.urls[2]).to.be('image3.jpg');
            });
            it('should make the viewer visible', function() {
                expect(viewerElement.className).to.be('');
            });
            it('should set the viewer\'s background image', function() {
                expect(imgElement.getAttribute('src')).to.be('image2.jpg');
            });
            it('should dispatch `input-disable` event', function() {
                expect(inputDisabled).to.be(true);
            });
        });
        describe('next()', function() {
            it('should move to the next image', function() {
                photoViewer.next();
                var data = photoViewer.data;
                expect(data.index).to.be(2);
                expect(imgElement.getAttribute('src')).to.be('image3.jpg');
            });
            it('should hide the next link', function() {
                var as =
                    viewerElement.getElementsByClassName('photo-viewer-nav')[0];

                var next = as.getElementsByClassName('nav-right')[0];
                expect(next.style.visibility).to.be('hidden');
            });
            it('should stop moving after no next image', function() {
                var data = photoViewer.data;
                photoViewer.next();
                expect(data.index).to.be(2);
                expect(imgElement.getAttribute('src')).to.be('image3.jpg');
            });
        });
        describe('previous()', function() {
            it('should move to the previous image', function() {
                photoViewer.previous();
                var data = photoViewer.data;
                expect(data.index).to.be(1);
                expect(imgElement.getAttribute('src')).to.be('image2.jpg');

                photoViewer.previous();
                expect(data.index).to.be(0);
                expect(imgElement.getAttribute('src')).to.be('image1.jpg');
            });
            it('should make the next link visible' ,function() {
                var as =
                    viewerElement.getElementsByClassName('photo-viewer-nav')[0];

                var next = as.getElementsByClassName('nav-right')[0];
                expect(next.style.visibility).to.not.be.ok();
            });
            it('should hide the previous link', function() {
                var as =
                    viewerElement.getElementsByClassName('photo-viewer-nav')[0];

                var next = as.getElementsByClassName('nav-left')[0];
                expect(next.style.visibility).to.be('hidden');
            });
            it('sould stop going back after 0', function() {
                var data = photoViewer.data;
                photoViewer.previous();
                expect(data.index).to.be(0);
                expect(imgElement.getAttribute('src')).to.be('image1.jpg');
            });
        });
        describe('key bindings', function() {
            it('should have the key codes defined', function() {
                expect(photoViewer.KEY_LEFT).to.be(37);
                expect(photoViewer.KEY_RIGHT).to.be(39);
                expect(photoViewer.KEY_ESCAPE).to.be(27);
            });
            it('should call next() on RIGHT', function() {
                var nextOrig = photoViewer.next, nextCalled = false;
                photoViewer.next = function() {
                    nextCalled = true;
                };

                fakeKeyDown(document, photoViewer.KEY_RIGHT);
                expect(nextCalled).to.be(true);
                photoViewer.next = nextOrig;
            });
            it('should call previous() on LEFT', function() {
                var previousOrig = photoViewer.previous, previousCalled = false;
                photoViewer.previous = function() {
                    previousCalled = true;
                };

                fakeKeyDown(document, photoViewer.KEY_LEFT);
                expect(previousCalled).to.be(true);
                photoViewer.previous = previousOrig;
            });
            it('should call close() on ESCAPE', function() {
                var closeOrig = photoViewer.close, closeCalled = false;
                photoViewer.close = function() {
                    closeCalled = true;
                };

                fakeKeyDown(document, photoViewer.KEY_ESCAPE);

                expect(closeCalled).to.be(true);
                photoViewer.close = closeOrig;
            });
        });
        describe('close()', function() {
            var inputEnabled;
            function onEnable() {
                inputEnabled = true;
            }
            before(function() {
                events.listen('input-enable', onEnable);
            });
            after(function() {
                events.unlisten('input-enable', onEnable);
            });
            it('should hide the viewerElement', function() {
                photoViewer.close();
                expect(viewerElement.className).to.be('invisible');
                expect(photoViewer.data.index).to.be(-1);
                expect(photoViewer.data.urls.length).to.be(0);
            });
            it('should dispatch `input-enable` event', function() {
                expect(inputEnabled).to.be(true);
            });
        });
        describe('event `photos`', function() {
            var showOrig, showArg, photos;
            before(function() {
                showOrig = photoViewer.show;
                photoViewer.show = function(index) {
                    showArg = index;
                };
            });
            after(function() {
                photoViewer.show = showOrig;
            });
            it('should update urls', function() {
                photos = ['test1.jpg', 'test2.jpg'];
                events.dispatch('photos', photos);

                expect(photoViewer.data.urls).to.be(photos);
            });
            it('should call show() with index = 0', function() {
                expect(showArg).to.be(0);
            });
        });
    });

});