'use strict';

let bookmarksCounter = require('./bookmarks-counter.js');
let popup = require('./popup.js');
let storage = require('./storage.js');

module.exports = {
    poll: function() {
        const newBookmarksThreshold = 2;
        let allBookmarksTree = browser.bookmarks.getTree();

        allBookmarksTree.then(function(results, logError) {
            // if there was an error, log it and return immediately
            if (logError) {
                console.error('Error getting current bookmarks count', logError);
                return;
            }

            let bookmarksTree = results;
            chrome.storage.local.get('originalBookmarksCount', function(counter) {
                if (chrome.runtime.lastError) {
                    console.error('Error getting original bookmarks count', chrome.runtime.lastError);
                    return;
                }

                // if originalBookmarksCount is undefined, this is the first iteration. Store
                // the current number of bookmarks and set a timeout for 5 seconds.
                if (typeof counter.originalBookmarksCount === 'undefined') {
                    storage.set({
                        'originalBookmarksCount': bookmarksCounter.getAllBookmarksCount(results)
                    });
                    window.setTimeout(module.exports.poll, 5000);
                } else {
                    let getOriginalBookmarksCount = browser.storage.local.get('originalBookmarksCount');
                    getOriginalBookmarksCount.then(function(item, logError) {
                        // if there was an error, log it and return immediately
                        if (logError) {
                            console.error('Error getting original bookmarks count', logError);
                            return;
                        }

                        let latestBookmarksCount = bookmarksCounter.getAllBookmarksCount(bookmarksTree);
                        let newBookmarksCount =  latestBookmarksCount - item.originalBookmarksCount;

                        // if we have not reached our threshold yet, set
                        // a new timeout.
                        if (newBookmarksCount < newBookmarksThreshold) {
                            window.setTimeout(module.exports.poll, 5000);
                        } else {
                            popup.showPopup();
                        }
                    });
                }
            });
        });
    }
};
