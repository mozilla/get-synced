'use strict';

let browserAction = require('./browser-action.js');
let storage = require('./storage.js');
let windowManager = require('./window-manager.js');

module.exports = {
    notificationAlarmHandler: function() {
        chrome.alarms.onAlarm.addListener(function(alarm) {
            if (alarm.name === 'showNotification') {
                module.exports.showNotification();
            }
        });
    },
    notificationClickHandler: function() {
        chrome.notifications.onClicked.addListener(function() {
            windowManager.openTab();
            browserAction.resetState();
        });
    },
    showNotification: function() {
        chrome.notifications.create({
            'type': 'basic',
            'iconUrl': chrome.extension.getURL('ui/media/icons/bookmarks.gif'),
            'title': 'Learn more about Sync',
            'message': 'Access your bookmarks on your phone, then call yourself a wizard, Wizard. Try it now.'
        }, function() {
            // store the time when this notification was shown
            storage.set({ 'lastNotificationTime': Date.now() });
            // start listening for click events
            module.exports.notificationClickHandler();
            // start listening for notification alarms
            module.exports.notificationAlarmHandler();
            // set the chrome icon to the active state
            browserAction.activateBrowserAction();
        });
    },
    storeNotificationCount: function() {
        let notificationCount = 1;
        chrome.storage.local.get('notificationCount', function(data) {
            // if notificationCount exists, increment the count by 1
            if (typeof data.notificationCount !== 'undefined') {
                notificationCount = data.notificationCount + 1;
            }
            // store the new or initial count
            storage.set({
                'notificationCount': notificationCount
            });
        });
    }
};
