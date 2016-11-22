'use strict';

module.exports = {
    openTab: function() {
        chrome.tabs.create({
            url: 'https://www.mozilla.org/firefox/sync/?utm_source=get-sycned-addon&utm_medium=firefox-browser&utm_campaign=get-synced-v-10'
        });
    }
};
