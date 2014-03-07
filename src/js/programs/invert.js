define(['cli/Program'], function(Program) {

    function createTheme() {
        var style = document.createElement('link');
        style.id = 'theme';
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('type', 'text/css');
        style.setAttribute('href', 'css/white-theme.css');

        document.getElementsByTagName('head')[0].appendChild(style);
    }

    var exports = new Program({
        name: 'invert',
        defaultAction: function(arg) {
            var theme = document.getElementById('theme');
            if (theme) {
                document.getElementsByTagName('head')[0].removeChild(theme);
                return;
            }
            createTheme();
        }
    });

    return exports;

});