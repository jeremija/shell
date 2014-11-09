define(['cli/Program', 'services/ajax', 'events/events', 'services/xml'],
    function(Program, ajax, events, parseXml)
{

    function getFeed(callback) {
        // var url = 'http://steiner.website/blog/rss';
        // var url = '/blog/rss';
        var url = '/example.rss';
        ajax.xml(url, {}, function(err,xml) {
            if (err) {
                exports.error('Error while loading feed: ' + err.message);
                return;
            }
            xml = parseXml(xml);
            callback(null, xml);
        });
    }

    function link(url, title) {
        title = title || url;
        exports.output(
            '<a href="' + url + '" target="_blank">' + title + '</a>');
    }

    function findByTag(node, tag) {
        var found;
        [].slice.call(node.children).some(function(child) {
            if (child.tagName === tag) {
                found = child;
                return true;
            }
        });
        return found;
    }

    function hideParserErrors(node) {
        var errors = node.querySelectorAll('parsererror');
        [].slice.call(errors).forEach(function(error) {
            error.parentNode.removeChild(error);
        });
        return node;
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
            this.output('  blog read 1               opens the post in a new window');
        },
        args: {
            'list': function() {
                getFeed(function(err, feed) {
                    var slice = [].slice;
                    var channel = feed.querySelector('rss channel');
                    var title = channel.querySelector('title').textContent;
                    var description = channel.querySelector('description').textContent;
                    var url = channel.querySelector('link').textContent;
                    link(url, title);
                    exports.output(description);
                    exports.output(' ');

                    function catMapper(cat) {
                        return cat.textContent;
                    }

                    var items = channel.querySelectorAll('item');
                    var i = 1;
                    slice.call(items).forEach(function(item) {
                        title = item.querySelector('title').textContent;
                        var date = item.querySelector('pubDate').textContent;
                        // var author = item.querySelector('dc\\:creator').textContent;
                        var author = findByTag(item, 'dc:creator').textContent;
                        date = new Date(date).toString() + ' by ' + author;
                        var cats = item.querySelectorAll('category');
                        cats = slice.call(cats).map(catMapper).join(', ');
                        url = item.querySelector('link').textContent;
                        link(url, i + '. ' + title);
                        if (cats) exports.output('  on ' + cats);
                        exports.output('  ' + date);
                        exports.output(' ');
                        i++;
                    });
                });
            },
            'read': function(index) {
                index = parseInt(index);
                if (isNaN(index) || index < 1) {
                    this.error('Invalid index, should be an integer from 1');
                    return;
                }
                index--;
                getFeed(function(err, feed) {
                    var links = feed.querySelectorAll('rss channel item link');
                    var len = links.length;
                    if (index >= len) {
                        exports.error('Index out of bounds, max is ' + len);
                        return;
                    }
                    events.dispatch('link', links[index].textContent);
                });
            },
            'view': function(index) {
                var slice = [].slice;
                index = parseInt(index);
                if (isNaN(index) || index < 1) {
                    this.error('Invalid index, should be an integer from 1');
                    return;
                }
                index--;
                getFeed(function(err, feed) {
                    var items = feed.querySelectorAll('rss channel item');
                    var len = items.length;
                    if (index >= len) {
                        exports.error('Index out of bounds, max is ' + len);
                        return;
                    }
                    exports.output(' ');
                    var item = items[index];
                    var title = item.querySelector('title').textContent;
                    var href = item.querySelector('link').textContent;
                    link(href, title);
                    exports.output(slice.call(title).map(function(letter) {
                        return '=';
                    }).join(''));
                    exports.output(' ');
                    var desc = item.querySelector('description').textContent;
                    desc = '<div>' + desc + '</div>';
                    desc = parseXml(desc);
                    var text = hideParserErrors(desc.firstChild).textContent;
                    exports.output(text.replace(/\n\s*\n/g, '\n\n'));
                    exports.output(' ');
                });
            }
        }
    });

    return exports;

});