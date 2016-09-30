'use strict';

module.exports = {
    bookmarksCount: 0,
    bookmarksArray: [],
    getAllBookmarksCount: function(results) {
        // each time getBookmarksCount is called, we want to first reset
        // the bookmarksCount back to 0 and clear the bookmarksArray
        module.exports.resetCount();
        // now call treeWalker to collect all the bookmarks
        module.exports.treeWalker(results, module.exports.bookmarksCount);
        return module.exports.bookmarksArray.length;
    },
    resetCount: function() {
        module.exports.bookmarksCount = 0;
        module.exports.bookmarksArray = [];
    },
    treeWalker: function(children) {
        for (let entry of children) {
            if (entry.url && entry.url.indexOf('places:') === -1) {
                module.exports.bookmarksArray.push(entry);
            }

            if (entry.children) {
                module.exports.treeWalker(entry.children);
            }
        }
    }
};
