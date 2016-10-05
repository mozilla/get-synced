'use strict';

let utils = require('./utils.js');

// 48 hours in minutes
let delayInMinutes = 3;

module.exports = {
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
        // clear any exiting alarmsr
        chrome.alarms.clearAll(function(wasCleared) {
            if (wasCleared) {
                // schedule the next to go off in 48 hours
                chrome.alarms.create('showNotification', {
                    delayInMinutes
                });
            }
        });
    }
};
