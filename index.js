'use strict';

let poller = require('./lib/poller.js');

(function() {
    // start polling bookmarks
    poller.poll();
})();
