'use strict';

const prefService = require('sdk/preferences/service');
const self = require('sdk/self');
const webExtension = require('sdk/webextension');

require('./lib/study').study.startup(self.loadReason);

webExtension.startup().then(function(api) {
    const { browser } = api;
    browser.runtime.onMessage.addListener((msg, sender, sendReply) => {
        if (msg === 'get-bookmarks-threshold-variation') {
            sendReply({
                variation: prefService.get('bookmarksThreshold')
            });
        }
    });
});
