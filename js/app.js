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

    // App Initializers
    function initEventHandlers() {
        main.delegate('click', handleTryButtonClicked, '.try-button');
        main.delegate('click', handleClearButtonClicked, '.clear-button');
        main.delegate('click', handleExampleClicked, '.examples a');
    }

    function init() {
    }
    initEventHandlers();
    init();
});
