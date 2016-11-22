'use strict';

let utils = require('./utils.js');

// 48 hours in minutes
let delayInMinutes = 2880;

module.exports = {
    clearAlarms: function() {
        // get all active alarms
        chrome.alarms.getAll(function(alarms) {
            // if there is at least one alarm
            if (alarms.length > 0) {
                chrome.alarms.clearAll();
            }
        });
    },
    restartTimer: function(lastNotificationTime) {
        let remainder = delayInMinutes - utils.getTimeElapsed(lastNotificationTime);
        // if the time remaining is two minutes or more,
        // schedule the notification for the remainder
        if (remainder >= 2) {
            delayInMinutes = remainder;
            chrome.alarms.create('showNotification', {
                delayInMinutes
            });
        } else {
            delayInMinutes = 1;
            // shedule the notification for a minute from now.
            chrome.alarms.create('showNotification', {
                delayInMinutes
            });
        }
    },
    scheduleNextNotification: function() {
        chrome.storage.local.get('notificationCount', function(data) {
            // only schedule another notification if this is the first
            // or, we have shown less that 3
            if (typeof data.notificationCount === 'undefined' ||
                data.notificationCount < 3) {
                // clear any exiting alarmsr
                module.exports.clearAlarms();
                // schedule the next to go off in 48 hours
                chrome.alarms.create('showNotification', {
                    delayInMinutes
                });
            }
        });
    }
};
