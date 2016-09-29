module.exports.bookmarksCounter = {
    getBookmarksCount: function() {
        let bookmarksCount = 0;
        let bookmarksTree = browser.bookmarks.getTree();

        bookmarksTree.then(function(results, logError) {
            if (logError) {
                console.error('Error getting bookmarks tree', logError);
            }
            return module.exports.walker(results, bookmarksCount);
        });
    },
    walker: function(children, bookmarksCount) {
        for (let entry of children) {
            console.error('entry of results', entry.children);

            if (entry.url) {
                console.error('increment 1');
                bookmarksCount = bookmarksCount + 1;
            }

            if (entry.children) {
                console.error(entry.children);
                this.walker(entry.children);
            }
        }
        console.error('walker()', bookmarksCount);
        return bookmarksCount;
    }
};
