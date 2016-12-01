'use strict';

let notificationManager = require('./lib/notification-manager.js');
let poller = require('./lib/poller.js');
let scheduler = require('./lib/scheduler.js');
let storage = require('./lib/storage.js');

(function() {
    chrome.storage.local.get('lastNotificationTime', function(timer) {
        if (chrome.runtime.lastError) {
            console.error('Error getting lastNotificationTime on startup', chrome.runtime.lastError);
            return;
        }
        // if lastNotificationTime is undefined, the user has not added
        // enough bookmarks to reach our threshold so, disable the chrome
        // icon, and start polling.
        if (typeof timer.lastNotificationTime === 'undefined') {
            // disable the browser_action
            chrome.browserAction.disable();

            // get the variation for this study from the SDK side
            browser.runtime.sendMessage('get-bookmarks-threshold-variation').then(function(reply, error) {
                if (error) {
                    console.error('Error sending message to SDK', error);
                    return;
                }

                // store the variation
                storage.set({ 'bookmarksThreshold': reply.variation });

                if (reply) {
                    // start polling bookmarks
                    poller.poll(reply.variation);
                }
            });
        } else {
            // restart the last notification alarm
            scheduler.restartTimer(timer.lastNotificationTime);
            // start listening for the alarm set above
            notificationManager.notificationAlarmHandler();
        }
    });
})();
