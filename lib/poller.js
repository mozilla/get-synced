let storage = require('./storage.js');

module.exports.poller = {
    poll: function() {
        let getLastPollBookmarksItem = browser.storage.local.get('lastPollBookmarksCount');

        getLastPollBookmarksItem.then(function(item, logError) {
            if (logError) {
                console.error('Error getting storage item:', chrome.runtime.lastError);
                return;
            }

            let bookmarksCount = getBookmarksCount();
            let lastPollBookmarksCount = item.lastPollBookmarksCount;
            console.error('lastPollBookmarksCount', lastPollBookmarksCount);
            console.error('lastPollBookmarksCount === 0', lastPollBookmarksCount === 0);

            // if lastPollBookmarksCount is 0, this is our first time polling
            // the bookmarks so, simple store the return value of getBookmarksCount
            if (lastPollBookmarksCount === 0) {
                storage.set({ 'lastPollBookmarksCount': bookmarksCount });
                // poll the bookmarks again in 5 seconds
                window.setTimeout(this.poll(), 5000);
            } else if ((bookmarksCount - lastPollBookmarksCount) < 2) {
                // seeing that lastPollBookmarksCount is no longer 0, this is not our
                // first poll of the bookmarks. Test above whether the user has
                // added less than our trigger count since last poll, then store the count.
                storage.set({ 'lastPollBookmarksCount': bookmarksCount });
                // poll the bookmarks again in 5 seconds
                window.setTimeout(this.poll(), 5000);
            } else {
                // the user has added more than the trogger count so,
                // show the notification
                console.error('2 or more bookmarks has been added');
            }

        });
    }
};
