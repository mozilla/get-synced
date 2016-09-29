'use strict';

module.exports = {
    bookmarksCount: 0,
    bookmarksArray: [],
    getBookmarksCount: function() {
        chrome.bookmarks.getTree(function(results) {
            console.error('got the tree', results);
            // each time getBookmarksCount is called, we want to first reset
            // the bookmarksCount back to 0 and clear the bookmarksArray
            console.error('restting counters');
            module.exports.resetCount();
            // now call treeWalker to collect all the bookmarks
            console.error('calling walker');
            module.exports.treeWalker(results, module.exports.bookmarksCount);
            console.error('Total number of bookmarks: ', module.exports.bookmarksArray.length);
            // return the length of the bookmarksArray after treeWalker completes.
            return module.exports.bookmarksArray.length;
        });
    },
    resetCount: function() {
        module.exports.bookmarksCount = 0;
        module.exports.bookmarksArray = [];
    },
    treeWalker: function(children) {
        console.error('entering walker');
        for (let entry of children) {
            console.error('walking the tree');
            if (entry.url) {
                module.exports.bookmarksArray.push(entry);
            }

            if (entry.children) {
                for (let child of entry.children) {
                    module.exports.bookmarksArray.push(child);
                }
                module.exports.treeWalker(entry.children);
            }
        }
    }
};
