YUI({
    modules: {
        'login-manager': {
            fullpath: 'js/htk/yui/modules/login_manager.js'
        }
    }
}).use(
    'node',
    'event',
    'login-manager',
function (Y) {
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

    function handleTryItClicked(e) {
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
        main.delegate('click', handleTryItClicked, '.try-it');
        main.delegate('click', handleExampleClicked, '.examples a');
    }

    function init() {
    }
    initEventHandlers();
    init();
});
