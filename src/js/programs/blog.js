define(['cli/Program', 'services/ajax', 'events/events'],
    function(Program, ajax, events)
{

    function getFeed(callback) {
        // var url = 'http://steiner.website/blog/rss';
        var url = '/blog/rss';
        // var url = '/example.rss';
        ajax.xml(url, {}, function(err,xml) {
            if (err) {
                exports.error('Error while loading feed: ' + err.message);
                return;
            }
            xml = xml.replace(/<link>/g, '<linker>')
                .replace(/<\/link>/g, '</linker>');
            var element = document.createElement('div');
            element.innerHTML = xml;
            callback(null, element);
        });
    }

    function format(text) {
        return text.replace('&lt;![CDATA[', '')
            .replace('<!--[CDATA[', '')
            .replace(']]&gt;', '')
            .replace(']]-->', '');
    }

    function output(text) {
        exports.output(format(text));
    }

    function link(url, title) {
        title = title ? format(title) : url;
        exports.output(
            '<a href="' + url + '" target="_blank">' + title + '</a>');
    }

    var exports = new Program({
        name: 'blog',
        defaultAction: function(args) {
            if (args) return;
            this.output('Displays my blog\'s RSS feed');
            this.output('Usage:  blog &lt;list | view&gt; [index]');
            this.output(' ');
            this.output('Examples:');
            this.output('  blog list                 shows all posts');
            this.output('  blog view 1               displays latest post');
        },
        args: {
            'list': function() {
                var self = this;
                getFeed(function(err, feed) {
                    var slice = [].slice;
                    var channel = feed.querySelector('rss channel');
                    var title = channel.querySelector('title').innerHTML;
                    var description = channel.querySelector('description').innerHTML;
                    var url = channel.querySelector('linker').innerHTML;
                    link(url, title);
                    output(description);
                    self.output(' ');

                    function catMapper(cat) {
                        return format(cat.innerHTML);
                    }

                    var items = channel.querySelectorAll('atom\\:link item');
                    var i = 1;
                    slice.call(items).forEach(function(item) {
                        title = item.querySelector('title').innerHTML;
                        var date = item.querySelector('pubdate').innerHTML;
                        var author = item.querySelector('dc\\:creator').innerHTML;
                        date = new Date(date).toString() + ' by ' + format(author);
                        var categories = item.querySelectorAll('category');
                        categories = slice.call(categories)
                            .map(catMapper).join(', ');
                        url = item.querySelector('linker').innerHTML;
                        link(url, i + '. ' + title);
                        if (categories) self.output('  on ' + categories);
                        output('  ' + date);
                        output(' ');
                        i++;
                    });
                });
            },
            'view': function(index) {
                index = parseInt(index);
                if (isNaN(index) || index < 1) {
                    this.error('Invalid index, should be an integer from 1');
                    return;
                }
                index--;
                var self = this;
                getFeed(function(err, feed) {
                    var slice = [].slice;
                    var links = feed.querySelectorAll(
                        'rss channel atom\\:link item linker');
                    var len = links.length;
                    if (index >= len) {
                        self.error('Index out of bounds, max is ' + len);
                        return;
                    }
                    events.dispatch('link', links[index].innerHTML);
                });
            }
        }
    });

    return exports;

});