define(['cli/util'], function(util) {

    describe('test/js/cli/util-test.js', function() {
        describe('escape()', function() {
            it('should escape html characters', function() {
                var text = util.escape('</>');
                expect(text).to.be.a('string');
                expect(text).to.be('&lt;/&gt;');
            });
        });
    });

});