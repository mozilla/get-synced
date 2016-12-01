'use strict';

module.exports = {
    openTab: function() {
        chrome.storage.local.get('bookmarksThreshold', function(study) {
            let params = '?utm_source=get-sycned-addon' +
                         '&utm_medium=firefox-browser' +
                         '&utm_campaign=get-synced-v-10' +
                         '&utm_content=notification-' + study.bookmarksThreshold;

            chrome.tabs.create({
                url: 'https://www.mozilla.org/firefox/sync/' + params
            });
        });
    }
};
