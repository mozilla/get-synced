'use strict';

module.exports = {
    bookmarksCount: 0,
    bookmarksArray: [],
    getBookmarksCount: function() {
        let bookmarksTree = browser.bookmarks.getTree();

        bookmarksTree.then(function(results, logError) {
            if (logError) {
                console.error('Error getting bookmarks tree', logError);
                return;
            }

            // each time getBookmarksCount is called, we want to first reset
            // the bookmarksCount back to 0
            module.exports.bookmarksCount = 0;
            // now call treeWalker to collect all the bookmarks
            module.exports.treeWalker(results, module.exports.bookmarksCount);
            console.error('Total number of bookmarks: ', module.exports.bookmarksArray.length);
            // return the length of the bookmarksArray after treeWalker completes.
            return module.exports.bookmarksArray.length;
        });
    },
    treeWalker: function(children) {
        console.error('entering walker');
        for (let entry of children) {
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
