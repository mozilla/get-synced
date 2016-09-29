'use strict';

let bookmarksCounter = require('./bookmarks-counter.js');
let storage = require('./storage.js');

module.exports = {
    poll: function() {
        let getLastPollBookmarksCount = browser.storage.local.get('lastPollBookmarksCount');

        getLastPollBookmarksCount.then(function(item, logError) {
            console.error('got getLastPollBookmarksCount', item);
            if (logError) {
                console.error('Error getting storage item:', chrome.runtime.lastError);
                return;
            }

            console.error('getting live bookmarks count');
            let bookmarksCount = bookmarksCounter.getBookmarksCount();
            console.error('got live bookmarks count', bookmarksCount);
            let lastPollBookmarksCount = item.lastPollBookmarksCount;
            console.error('lastPollBookmarksCount', lastPollBookmarksCount);

            // if lastPollBookmarksCount is 0, this is our first time polling
            // the bookmarks so, simple store the return value of getBookmarksCount
            if (lastPollBookmarksCount === 0) {
                console.error('This is the first time, setting the count to', bookmarksCount);
                storage.set({ 'lastPollBookmarksCount': bookmarksCount });
                // poll the bookmarks again in 5 seconds
                console.error('setting timeout to call poll again in 5 seconds');
                window.setTimeout(module.exports.poll, 5000);
            } else if ((bookmarksCount - lastPollBookmarksCount) < 2) {
                console.error('less than two bookmarks');
                // seeing that lastPollBookmarksCount is no longer 0, this is not our
                // first poll of the bookmarks. Test above whether the user has
                // added less than our trigger count since last poll, then store the count.
                storage.set({ 'lastPollBookmarksCount': bookmarksCount });
                // poll the bookmarks again in 5 seconds
                window.setTimeout(module.exports.poll, 5000);
            } else {
                // the user has added more than the trogger count so,
                // show the notification
                console.error('2 or more bookmarks has been added');
            }

        });
    }
};
