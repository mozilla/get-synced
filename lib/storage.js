module.exports.storage = {
    initLastPollBookmarksCount: function() {
        chrome.storage.local.set({ 'lastPollBookmarksCount': 0 }, module.exports.onStorageSet);
    },
    onStorageSet: function() {
        if (chrome.runtime.lastError) {
            console.error('Error setting storage item:', chrome.runtime.lastError);
        }
    },
    set: function(item) {
        chrome.storage.local.set(item, module.exports.onStorageSet);
    }
};
