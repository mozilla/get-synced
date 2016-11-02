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
        this.browserActionClickHandler();
    },
    browserActionClickHandler: function() {
        chrome.browserAction.onClicked.addListener(function() {
            windowManager.openTab();
            this.resetState();
        });
    },
    resetState: function() {
        // update the icon to the active state
        chrome.browserAction.setIcon({
            path: 'icons/icon-32.png'
        });
    }
};
