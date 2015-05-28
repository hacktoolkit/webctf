var _Y = null; // global handle to YUI object

YUI({
    modules: {
        'login-manager': {
            fullpath: 'js/htk/yui/modules/login_manager.js'
        },
        'web-console': {
            fullpath : 'js/htk/yui/modules/web_console.js'
        }
    }
}).use(
    'node',
    'event',
    'login-manager',
    'web-console',
function (Y) {
    _Y = Y;
    /* -------------------------------------------------- */
    /* YUI "Local" Globals */

    // CSS selectors
    var CSS_CLASS_HIDDEN = 'hidden';
    var CSS_CLASS_ACTIVE = 'active';

    // Nodes
    var header = Y.one('#header');
    var main = Y.one('#main');

    // App variables
    var _FACEBOOK_INITIALIZED = false;

    /* End YUI "Local" Globals */
    /* -------------------------------------------------- */

    // Custom App Functions

    function handleTryButtonClicked(e) {
        executeConsole();
//        Y.WebConsole.toggle();
    }

    function handleClearButtonClicked(e) {
        $('.webconsole').val('');
        executeConsole();
    }

    function executeConsole() {
        var consoleContent = $('.webconsole').val();
        $('.output').html(consoleContent);
    }

    function handleExampleClicked(e) {
        var node = e.target;
        var exampleId = node.getAttribute('data:example_id');
        var t = _.template($('#t_example' + exampleId).html());
        $('.webconsole').val(t);
    }

    function handleAboutButtonClicked(e) {
        var about = Y.one('.about');
        if (about.hasClass(CSS_CLASS_ACTIVE)) {
            about.removeClass(CSS_CLASS_ACTIVE);
        } else {
            about.addClass(CSS_CLASS_ACTIVE);
        }
    }

    function handleWallButtonClicked(e) {
        var wall = Y.one('.graffiti-wall');
        if (wall.hasClass(CSS_CLASS_ACTIVE)) {
            wall.removeClass(CSS_CLASS_ACTIVE);
        } else {
            wall.addClass(CSS_CLASS_ACTIVE);
        }
    }

    function attackVector(codeSnippet) {
        var imgTag = '<img src="' + codeSnippet + '" />';
        // https://c1.staticflickr.com/9/8772/16480169323_dec016d55b_z.jpg
        $('.output').html(imgTag);
    }

    function storeWebCTFCodeSnippet() {
        var user = Parse.User.current();
        user.set('webctfCodeSnippet', $('.webconsole').val());
        user.save();
    }

    function runWebCTFCodeSnippet() {
        var location = window.location;
        var queryString = location.search;
        if (queryString.length > 0) {
            var kvString = queryString.substring(1);
            var pairs = kvString.split('&');
            var ctfUsername = null;
            for (var i=0; i < pairs.length; ++i) {
                var pair = pairs[i].split('=');
                if (pair.length == 2) {
                    if (pair[0] == 'ctf') {
                        ctfUsername = pair[1];
}
                }
            }
            if (ctfUsername) {
                var query = new Parse.Query(Parse.User);
                query.equalTo('username', ctfUsername);
                query.find({
                    success: function(results) {
                        for (var i = 0; i < results.length; ++i) {
                            var user = results[i];
                            var codeSnippet = user.get('webctfCodeSnippet');
                            attackVector(codeSnippet);
                        }
                    },
                    error: function(error) {
                    }
                });
            }
        }
    }

    function loadWebCTFCodeSnippet() {
        var user = Parse.User.current();
        user.refresh().then(function(updatedUser) {
            var codeSnippet = updatedUser.get('webctfCodeSnippet');
            $('.webconsole').val(codeSnippet);
        });
    }

    function handleCloudSaveButtonClicked(e) {
        storeWebCTFCodeSnippet();
    }

    function handleCloudLoadButtonClicked(e) {
        loadWebCTFCodeSnippet();
    }

    function handleCloudRunButtonClicked(e) {
        var user = Parse.User.current();
        var ctfUrl = buildCloudRunUrl(user);
        window.open(ctfUrl);
    }

    function buildCloudRunUrl(user) {
        var location = window.location;
        var url = location.protocol + '//' + location.host + location.pathname;
        var ctfUrl = url + '?ctf=' + user.get('username');
        return ctfUrl;
    }

    function populateGraffitiList() {
        var query = new Parse.Query(Parse.User);
        query.notEqualTo('webctfCodeSnippet', '');
        query.ascending('createdAt');
        query.find({
            success: function(results) {
                var users = results;
                var stuff = _.map(users, function(user) {
                    var ctfUrl = buildCloudRunUrl(user);
                    var markup = '<li><a href="' + ctfUrl + '" target="_blank">' + user.getName() + '</a></li>';
                    return markup;
                });
                $('.wall-content').html('<ul>' + stuff.join('') + '</ul>');
            },
            error: function(error) {
            }
        });

    }

    function handleUserNameClicked(e) {
        var user = Parse.User.current();
        var username = prompt('Desired username', user.get('username'));
        if (username !== '') {
            var user = Parse.User.current();
            user.set('username', username);
            user.save();
        }
    }

    // App Initializers
    function initEventHandlers() {
        main.delegate('click', handleTryButtonClicked, '.try-button');
        main.delegate('click', handleClearButtonClicked, '.clear-button');
        main.delegate('click', handleExampleClicked, '.examples .example');
        main.delegate('click', handleAboutButtonClicked, '.about-button');
        main.delegate('click', handleWallButtonClicked, '.wall-button');
        main.delegate('click', handleCloudSaveButtonClicked, '.cloud-save-button');
        main.delegate('click', handleCloudLoadButtonClicked, '.cloud-load-button');
        main.delegate('click', handleCloudRunButtonClicked, '.cloud-run-button');
        header.delegate('click', handleUserNameClicked, '.login-user-info');
    }

    function init() {
        Y.on('load', function(e) {
            runWebCTFCodeSnippet();
            populateGraffitiList();
        });
    }
    initEventHandlers();
    init();
});
