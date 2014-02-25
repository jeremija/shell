define(['events/link', 'events/events'], function(link, events) {

    describe('test/js/events/link-test.js', function() {
        var outputs = [], openLinkOrig, openLinkHref;
        before(function() {
            events.listen('output', function(text) {
                outputs.push(text);
            });
            openLinkOrig = link.openLink;
            link.openLink = function(href) {
                openLinkHref = href;
            };
        });
        after(function() {
            events.clear();
            link.openLink = openLinkOrig;
        });
        it('should be ok', function() {
            expect(link).to.be.ok();
        });
        describe('init()', function() {
            it('should be a function', function() {
                expect(link.init).to.be.a('function');
            });
            it('should start listening to `link` event', function() {
                link.init();
                expect(events._listeners.link).to.be.ok();
                expect(events._listeners.link.length).to.be(1);
                expect(events._listeners.link[0].callback).to.be(link._onLink);
            });
        });
        describe('event `link`', function() {
            it('should write output on `link` event', function() {
                events.dispatch('link', 'http://example.com');
                expect(outputs.length).to.be.greaterThan(0);
            });
            it('should open a new window event', function() {
                expect(openLinkHref).to.be('http://example.com');
            });
        });
    });

});