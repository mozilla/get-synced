'use strict';

let poller = require('./lib/poller.js');
let storage = require('./lib/storage.js');

(function() {
    // if lastPollBookmarksCount is undefined, initialize it to 0
    if (typeof chrome.storage.local.get('lastPollBookmarksCount') === 'undefined') {
        storage.initLastPollBookmarksCount();
    }
    // start polling bookmarks
    poller.poll();
})();
