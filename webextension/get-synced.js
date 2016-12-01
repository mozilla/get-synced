(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./lib/notification-manager.js":4,"./lib/poller.js":5,"./lib/scheduler.js":6,"./lib/storage.js":7}],2:[function(require,module,exports){
'use strict';

module.exports = {
    bookmarksCount: 0,
    bookmarksArray: [],
    getAllBookmarksCount: function(results) {
        // each time getBookmarksCount is called, we want to first reset
        // the bookmarksCount back to 0 and clear the bookmarksArray
        module.exports.resetCount();
        // now call treeWalker to collect all the bookmarks
        module.exports.treeWalker(results, module.exports.bookmarksCount);
        return module.exports.bookmarksArray.length;
    },
    resetCount: function() {
        module.exports.bookmarksCount = 0;
        module.exports.bookmarksArray = [];
    },
    treeWalker: function(children) {
        for (let entry of children) {
            if (entry.url && entry.url.indexOf('places:') === -1) {
                module.exports.bookmarksArray.push(entry);
            }

            if (entry.children) {
                module.exports.treeWalker(entry.children);
            }
        }
    }
};

},{}],3:[function(require,module,exports){
'use strict';

let scheduler = require('./scheduler.js');
let windowManager = require('./window-manager.js');

module.exports = {
    activateBrowserAction: function() {
        // enable the browser_action
        chrome.browserAction.enable();
        // update the icon to the active state
        chrome.browserAction.setIcon({
            path: 'icons/icon-32_active.png'
        });
        // schedule the next notification which
        // will happen in 48 hours.
        scheduler.scheduleNextNotification();
        module.exports.browserActionClickHandler();
    },
    browserActionClickHandler: function() {
        chrome.browserAction.onClicked.addListener(function() {
            windowManager.openTab();
            module.exports.resetState();
        });
    },
    resetState: function() {
        // update the icon to the active state
        chrome.browserAction.setIcon({
            path: 'icons/icon-32.png'
        });
    }
};

},{"./scheduler.js":6,"./window-manager.js":9}],4:[function(require,module,exports){
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
            'title': 'Access your bookmarks on your phone',
            'message': 'Then call yourself a wizard, Wizard. Try it now.'
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

},{"./browser-action.js":3,"./storage.js":7,"./window-manager.js":9}],5:[function(require,module,exports){
'use strict';

let bookmarksCounter = require('./bookmarks-counter.js');
let notificationManager = require('./notification-manager.js');
let storage = require('./storage.js');

module.exports = {
    poll: function(newBookmarksThreshold) {
        let allBookmarksTree = browser.bookmarks.getTree();

        allBookmarksTree.then(function(results, logError) {
            // if there was an error, log it and return immediately
            if (logError) {
                console.error('Error getting current bookmarks count', logError);
                return;
            }

            let bookmarksTree = results;
            chrome.storage.local.get('originalBookmarksCount', function(counter) {
                if (chrome.runtime.lastError) {
                    console.error('Error getting original bookmarks count', chrome.runtime.lastError);
                    return;
                }

                // if originalBookmarksCount is undefined, this is the first iteration. Store
                // the current number of bookmarks and set a timeout for 5 seconds.
                if (typeof counter.originalBookmarksCount === 'undefined') {
                    storage.set({ 'originalBookmarksCount': bookmarksCounter.getAllBookmarksCount(results) });
                    module.exports.reschedulePoller(newBookmarksThreshold);
                } else {
                    let getOriginalBookmarksCount = browser.storage.local.get('originalBookmarksCount');
                    getOriginalBookmarksCount.then(function(item, logError) {
                        // if there was an error, log it and return immediately
                        if (logError) {
                            console.error('Error getting original bookmarks count', logError);
                            return;
                        }

                        let latestBookmarksCount = bookmarksCounter.getAllBookmarksCount(bookmarksTree);
                        let newBookmarksCount =  latestBookmarksCount - item.originalBookmarksCount;

                        // if we have not reached our threshold yet, set
                        // a new timeout.
                        if (newBookmarksCount < newBookmarksThreshold) {
                            module.exports.reschedulePoller(newBookmarksThreshold);
                        } else {
                            // shows the notification
                            notificationManager.showNotification();
                        }
                    });
                }
            });
        });
    },
    reschedulePoller: function(newBookmarksThreshold) {
        window.setTimeout(function() {
            module.exports.poll(newBookmarksThreshold);
        }, 5000);
    }
};

},{"./bookmarks-counter.js":2,"./notification-manager.js":4,"./storage.js":7}],6:[function(require,module,exports){
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

},{"./utils.js":8}],7:[function(require,module,exports){
'use strict';

module.exports = {
    onStorageSet: function() {
        if (chrome.runtime.lastError) {
            console.error('Error setting storage item:', chrome.runtime.lastError);
            return;
        }
    },
    set: function(item) {
        chrome.storage.local.set(item, module.exports.onStorageSet);
    }
};

},{}],8:[function(require,module,exports){
'use strict';

module.exports = {
    /**
    * Determines the number of milliseconds that elapsed since the last notification was shown.
    * @param {string} lastNotificationTime - Time in milliseconds read from storage
    * @returns The number of minutes as an int.
    */
    getTimeElapsed: function(lastNotificationTime) {
        let lastNotification = new Date(lastNotificationTime);
        return parseInt((Date.now() - lastNotification.getTime()) / 60000, 10);
    }
};

},{}],9:[function(require,module,exports){
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

},{}]},{},[1]);
