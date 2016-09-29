(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

let poller = require('./lib/poller.js');
let storage = require('./lib/storage.js');

(function() {
    // if lastPollBookmarksCount is undefined, initialize it to 0
    if (typeof chrome.storage.local.get('lastPollBookmarksCount') === 'undefined') {
        storage.initLastPollBookmarksCount();
    }
    // start polling bookmarks
    poller.poll();
})();

},{"./lib/poller.js":2,"./lib/storage.js":3}],2:[function(require,module,exports){
let storage = require('./storage.js');

module.exports.poller = {
    poll: function() {
        let getLastPollBookmarksItem = browser.storage.local.get('lastPollBookmarksCount');

        getLastPollBookmarksItem.then(function(item, logError) {
            if (logError) {
                console.error('Error getting storage item:', chrome.runtime.lastError);
                return;
            }

            let bookmarksCount = getBookmarksCount();
            let lastPollBookmarksCount = item.lastPollBookmarksCount;
            console.error('lastPollBookmarksCount', lastPollBookmarksCount);
            console.error('lastPollBookmarksCount === 0', lastPollBookmarksCount === 0);

            // if lastPollBookmarksCount is 0, this is our first time polling
            // the bookmarks so, simple store the return value of getBookmarksCount
            if (lastPollBookmarksCount === 0) {
                storage.set({ 'lastPollBookmarksCount': bookmarksCount });
                // poll the bookmarks again in 5 seconds
                window.setTimeout(this.poll(), 5000);
            } else if ((bookmarksCount - lastPollBookmarksCount) < 2) {
                // seeing that lastPollBookmarksCount is no longer 0, this is not our
                // first poll of the bookmarks. Test above whether the user has
                // added less than our trigger count since last poll, then store the count.
                storage.set({ 'lastPollBookmarksCount': bookmarksCount });
                // poll the bookmarks again in 5 seconds
                window.setTimeout(this.poll(), 5000);
            } else {
                // the user has added more than the trogger count so,
                // show the notification
                console.error('2 or more bookmarks has been added');
            }

        });
    }
};

},{"./storage.js":3}],3:[function(require,module,exports){
module.exports.storage = {
    initLastPollBookmarksCount: function() {
        chrome.storage.local.set({ 'lastPollBookmarksCount': 0 }, module.exports.onStorageSet);
    },
    onStorageSet: function() {
        if (chrome.runtime.lastError) {
            console.error('Error setting storage item:', chrome.runtime.lastError);
        }
    },
    set: function(item) {
        chrome.storage.local.set(item, module.exports.onStorageSet);
    }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImluZGV4LmpzIiwibGliL3BvbGxlci5qcyIsImxpYi9zdG9yYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmxldCBwb2xsZXIgPSByZXF1aXJlKCcuL2xpYi9wb2xsZXIuanMnKTtcbmxldCBzdG9yYWdlID0gcmVxdWlyZSgnLi9saWIvc3RvcmFnZS5qcycpO1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgLy8gaWYgbGFzdFBvbGxCb29rbWFya3NDb3VudCBpcyB1bmRlZmluZWQsIGluaXRpYWxpemUgaXQgdG8gMFxuICAgIGlmICh0eXBlb2YgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdsYXN0UG9sbEJvb2ttYXJrc0NvdW50JykgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHN0b3JhZ2UuaW5pdExhc3RQb2xsQm9va21hcmtzQ291bnQoKTtcbiAgICB9XG4gICAgLy8gc3RhcnQgcG9sbGluZyBib29rbWFya3NcbiAgICBwb2xsZXIucG9sbCgpO1xufSkoKTtcbiIsImxldCBzdG9yYWdlID0gcmVxdWlyZSgnLi9zdG9yYWdlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzLnBvbGxlciA9IHtcbiAgICBwb2xsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGdldExhc3RQb2xsQm9va21hcmtzSXRlbSA9IGJyb3dzZXIuc3RvcmFnZS5sb2NhbC5nZXQoJ2xhc3RQb2xsQm9va21hcmtzQ291bnQnKTtcblxuICAgICAgICBnZXRMYXN0UG9sbEJvb2ttYXJrc0l0ZW0udGhlbihmdW5jdGlvbihpdGVtLCBsb2dFcnJvcikge1xuICAgICAgICAgICAgaWYgKGxvZ0Vycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZ2V0dGluZyBzdG9yYWdlIGl0ZW06JywgY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBib29rbWFya3NDb3VudCA9IGdldEJvb2ttYXJrc0NvdW50KCk7XG4gICAgICAgICAgICBsZXQgbGFzdFBvbGxCb29rbWFya3NDb3VudCA9IGl0ZW0ubGFzdFBvbGxCb29rbWFya3NDb3VudDtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2xhc3RQb2xsQm9va21hcmtzQ291bnQnLCBsYXN0UG9sbEJvb2ttYXJrc0NvdW50KTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2xhc3RQb2xsQm9va21hcmtzQ291bnQgPT09IDAnLCBsYXN0UG9sbEJvb2ttYXJrc0NvdW50ID09PSAwKTtcblxuICAgICAgICAgICAgLy8gaWYgbGFzdFBvbGxCb29rbWFya3NDb3VudCBpcyAwLCB0aGlzIGlzIG91ciBmaXJzdCB0aW1lIHBvbGxpbmdcbiAgICAgICAgICAgIC8vIHRoZSBib29rbWFya3Mgc28sIHNpbXBsZSBzdG9yZSB0aGUgcmV0dXJuIHZhbHVlIG9mIGdldEJvb2ttYXJrc0NvdW50XG4gICAgICAgICAgICBpZiAobGFzdFBvbGxCb29rbWFya3NDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHN0b3JhZ2Uuc2V0KHsgJ2xhc3RQb2xsQm9va21hcmtzQ291bnQnOiBib29rbWFya3NDb3VudCB9KTtcbiAgICAgICAgICAgICAgICAvLyBwb2xsIHRoZSBib29rbWFya3MgYWdhaW4gaW4gNSBzZWNvbmRzXG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQodGhpcy5wb2xsKCksIDUwMDApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgoYm9va21hcmtzQ291bnQgLSBsYXN0UG9sbEJvb2ttYXJrc0NvdW50KSA8IDIpIHtcbiAgICAgICAgICAgICAgICAvLyBzZWVpbmcgdGhhdCBsYXN0UG9sbEJvb2ttYXJrc0NvdW50IGlzIG5vIGxvbmdlciAwLCB0aGlzIGlzIG5vdCBvdXJcbiAgICAgICAgICAgICAgICAvLyBmaXJzdCBwb2xsIG9mIHRoZSBib29rbWFya3MuIFRlc3QgYWJvdmUgd2hldGhlciB0aGUgdXNlciBoYXNcbiAgICAgICAgICAgICAgICAvLyBhZGRlZCBsZXNzIHRoYW4gb3VyIHRyaWdnZXIgY291bnQgc2luY2UgbGFzdCBwb2xsLCB0aGVuIHN0b3JlIHRoZSBjb3VudC5cbiAgICAgICAgICAgICAgICBzdG9yYWdlLnNldCh7ICdsYXN0UG9sbEJvb2ttYXJrc0NvdW50JzogYm9va21hcmtzQ291bnQgfSk7XG4gICAgICAgICAgICAgICAgLy8gcG9sbCB0aGUgYm9va21hcmtzIGFnYWluIGluIDUgc2Vjb25kc1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHRoaXMucG9sbCgpLCA1MDAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhlIHVzZXIgaGFzIGFkZGVkIG1vcmUgdGhhbiB0aGUgdHJvZ2dlciBjb3VudCBzbyxcbiAgICAgICAgICAgICAgICAvLyBzaG93IHRoZSBub3RpZmljYXRpb25cbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCcyIG9yIG1vcmUgYm9va21hcmtzIGhhcyBiZWVuIGFkZGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzLnN0b3JhZ2UgPSB7XG4gICAgaW5pdExhc3RQb2xsQm9va21hcmtzQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyAnbGFzdFBvbGxCb29rbWFya3NDb3VudCc6IDAgfSwgbW9kdWxlLmV4cG9ydHMub25TdG9yYWdlU2V0KTtcbiAgICB9LFxuICAgIG9uU3RvcmFnZVNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHNldHRpbmcgc3RvcmFnZSBpdGVtOicsIGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoaXRlbSwgbW9kdWxlLmV4cG9ydHMub25TdG9yYWdlU2V0KTtcbiAgICB9XG59O1xuIl19
