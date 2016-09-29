'use strict';

let poller = require('./lib/poller.js');
let storage = require('./lib/storage.js');

(function() {
    // if lastPollBookmarksCount is undefined, initialize it to 0
    if (typeof chrome.storage.local.get('lastPollBookmarksCount') === 'undefined') {
        console.error('initialising bookmarks count in storage');
        storage.initLastPollBookmarksCount();
    }
    // start polling bookmarks
    console.error('start polling');
    poller.poll();
})();
