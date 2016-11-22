'use strict';

let notificationManager = require('./lib/notification-manager.js');
let poller = require('./lib/poller.js');
let scheduler = require('./lib/scheduler.js');

(function() {
    browser.runtime.sendMessage('message-from-webextension').then(function(reply, error) {
        if (error) {
            console.error('Error sending message', error);
            return;
        }

        if (reply) {
            console.log('response from legacy add-on: ' + reply.content);
        }
    });
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
            // start polling bookmarks
            poller.poll();
        } else {
            // restart the last notification alarm
            scheduler.restartTimer(timer.lastNotificationTime);
            // start listening for the alarm set above
            notificationManager.notificationAlarmHandler();
        }
    });
})();
