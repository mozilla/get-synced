'use strict';

let poller = require('./lib/poller.js');

(function() {
    // disable the browser_action
    chrome.browserAction.disable();
    // start polling bookmarks
    poller.poll();
})();
