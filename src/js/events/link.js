define(['events/events'], function(events) {

    events.listen('link', function(link) {
        var a = document.createElement('a');
        a.id = 'link-event';
        a.style.position = 'fixed';
        a.style.left = '-9999px';
        a.innerHTML = 'a link';
        a.setAttribute('href', link);
        a.setAttribute('target', '_blank');
        document.body.appendChild(a);
        a.click();
        a.remove();
    });

});