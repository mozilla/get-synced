'use strict';

const webExtension = require('sdk/webextension');

webExtension.startup().then(function(api) {
    const {browser} = api;
    browser.runtime.onMessage.addListener((msg, sender, sendReply) => {
        if (msg === 'message-from-webextension') {
            sendReply({
                content: 'reply from legacy add-on'
            });
        }
    });
});
