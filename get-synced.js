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

},{"./lib/poller.js":3,"./lib/storage.js":4}],2:[function(require,module,exports){
'use strict';

module.exports = {
    bookmarksCount: 0,
    bookmarksArray: [],
    getBookmarksCount: function() {
        let bookmarksTree = browser.bookmarks.getTree();

        bookmarksTree.then(function(results, logError) {
            if (logError) {
                console.error('Error getting bookmarks tree', logError);
                return;
            }

            // each time getBookmarksCount is called, we want to first reset
            // the bookmarksCount back to 0
            module.exports.bookmarksCount = 0;
            // now call treeWalker to collect all the bookmarks
            module.exports.treeWalker(results, module.exports.bookmarksCount);
            console.error('Total number of bookmarks: ', module.exports.bookmarksArray.length);
            // return the length of the bookmarksArray after treeWalker completes.
            return module.exports.bookmarksArray.length;
        });
    },
    treeWalker: function(children) {
        console.error('entering walker');
        for (let entry of children) {
            if (entry.url) {
                module.exports.bookmarksArray.push(entry);
            }

            if (entry.children) {
                for (let child of entry.children) {
                    module.exports.bookmarksArray.push(child);
                }
                module.exports.treeWalker(entry.children);
            }
        }
    }
};

},{}],3:[function(require,module,exports){
'use strict';

let bookmarksCounter = require('./bookmarks-counter.js');
let storage = require('./storage.js');

module.exports = {
    poll: function() {
        let getLastPollBookmarksItem = browser.storage.local.get('lastPollBookmarksCount');

        getLastPollBookmarksItem.then(function(item, logError) {
            if (logError) {
                console.error('Error getting storage item:', chrome.runtime.lastError);
                return;
            }

            let bookmarksCount = bookmarksCounter.getBookmarksCount();
            let lastPollBookmarksCount = item.lastPollBookmarksCount;

            // if lastPollBookmarksCount is 0, this is our first time polling
            // the bookmarks so, simple store the return value of getBookmarksCount
            if (lastPollBookmarksCount === 0) {
                storage.set({ 'lastPollBookmarksCount': bookmarksCount });
                // poll the bookmarks again in 5 seconds
                window.setTimeout(module.exports.poll, 5000);
            } else if ((bookmarksCount - lastPollBookmarksCount) < 2) {
                // seeing that lastPollBookmarksCount is no longer 0, this is not our
                // first poll of the bookmarks. Test above whether the user has
                // added less than our trigger count since last poll, then store the count.
                storage.set({ 'lastPollBookmarksCount': bookmarksCount });
                // poll the bookmarks again in 5 seconds
                window.setTimeout(module.exports.poll, 5000);
            } else {
                // the user has added more than the trogger count so,
                // show the notification
                console.error('2 or more bookmarks has been added');
            }

        });
    }
};

},{"./bookmarks-counter.js":2,"./storage.js":4}],4:[function(require,module,exports){
'use strict';

module.exports = {
    initLastPollBookmarksCount: function() {
        chrome.storage.local.set({ 'lastPollBookmarksCount': 0 }, module.exports.onStorageSet);
    },
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImluZGV4LmpzIiwibGliL2Jvb2ttYXJrcy1jb3VudGVyLmpzIiwibGliL3BvbGxlci5qcyIsImxpYi9zdG9yYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxubGV0IHBvbGxlciA9IHJlcXVpcmUoJy4vbGliL3BvbGxlci5qcycpO1xubGV0IHN0b3JhZ2UgPSByZXF1aXJlKCcuL2xpYi9zdG9yYWdlLmpzJyk7XG5cbihmdW5jdGlvbigpIHtcbiAgICAvLyBpZiBsYXN0UG9sbEJvb2ttYXJrc0NvdW50IGlzIHVuZGVmaW5lZCwgaW5pdGlhbGl6ZSBpdCB0byAwXG4gICAgaWYgKHR5cGVvZiBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ2xhc3RQb2xsQm9va21hcmtzQ291bnQnKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgc3RvcmFnZS5pbml0TGFzdFBvbGxCb29rbWFya3NDb3VudCgpO1xuICAgIH1cbiAgICAvLyBzdGFydCBwb2xsaW5nIGJvb2ttYXJrc1xuICAgIHBvbGxlci5wb2xsKCk7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBib29rbWFya3NDb3VudDogMCxcbiAgICBib29rbWFya3NBcnJheTogW10sXG4gICAgZ2V0Qm9va21hcmtzQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgYm9va21hcmtzVHJlZSA9IGJyb3dzZXIuYm9va21hcmtzLmdldFRyZWUoKTtcblxuICAgICAgICBib29rbWFya3NUcmVlLnRoZW4oZnVuY3Rpb24ocmVzdWx0cywgbG9nRXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChsb2dFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgYm9va21hcmtzIHRyZWUnLCBsb2dFcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBlYWNoIHRpbWUgZ2V0Qm9va21hcmtzQ291bnQgaXMgY2FsbGVkLCB3ZSB3YW50IHRvIGZpcnN0IHJlc2V0XG4gICAgICAgICAgICAvLyB0aGUgYm9va21hcmtzQ291bnQgYmFjayB0byAwXG4gICAgICAgICAgICBtb2R1bGUuZXhwb3J0cy5ib29rbWFya3NDb3VudCA9IDA7XG4gICAgICAgICAgICAvLyBub3cgY2FsbCB0cmVlV2Fsa2VyIHRvIGNvbGxlY3QgYWxsIHRoZSBib29rbWFya3NcbiAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzLnRyZWVXYWxrZXIocmVzdWx0cywgbW9kdWxlLmV4cG9ydHMuYm9va21hcmtzQ291bnQpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignVG90YWwgbnVtYmVyIG9mIGJvb2ttYXJrczogJywgbW9kdWxlLmV4cG9ydHMuYm9va21hcmtzQXJyYXkubGVuZ3RoKTtcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgbGVuZ3RoIG9mIHRoZSBib29rbWFya3NBcnJheSBhZnRlciB0cmVlV2Fsa2VyIGNvbXBsZXRlcy5cbiAgICAgICAgICAgIHJldHVybiBtb2R1bGUuZXhwb3J0cy5ib29rbWFya3NBcnJheS5sZW5ndGg7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgdHJlZVdhbGtlcjogZnVuY3Rpb24oY2hpbGRyZW4pIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignZW50ZXJpbmcgd2Fsa2VyJyk7XG4gICAgICAgIGZvciAobGV0IGVudHJ5IG9mIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAoZW50cnkudXJsKSB7XG4gICAgICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMuYm9va21hcmtzQXJyYXkucHVzaChlbnRyeSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlbnRyeS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGVudHJ5LmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzLmJvb2ttYXJrc0FycmF5LnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtb2R1bGUuZXhwb3J0cy50cmVlV2Fsa2VyKGVudHJ5LmNoaWxkcmVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmxldCBib29rbWFya3NDb3VudGVyID0gcmVxdWlyZSgnLi9ib29rbWFya3MtY291bnRlci5qcycpO1xubGV0IHN0b3JhZ2UgPSByZXF1aXJlKCcuL3N0b3JhZ2UuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcG9sbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBnZXRMYXN0UG9sbEJvb2ttYXJrc0l0ZW0gPSBicm93c2VyLnN0b3JhZ2UubG9jYWwuZ2V0KCdsYXN0UG9sbEJvb2ttYXJrc0NvdW50Jyk7XG5cbiAgICAgICAgZ2V0TGFzdFBvbGxCb29rbWFya3NJdGVtLnRoZW4oZnVuY3Rpb24oaXRlbSwgbG9nRXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChsb2dFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgc3RvcmFnZSBpdGVtOicsIGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYm9va21hcmtzQ291bnQgPSBib29rbWFya3NDb3VudGVyLmdldEJvb2ttYXJrc0NvdW50KCk7XG4gICAgICAgICAgICBsZXQgbGFzdFBvbGxCb29rbWFya3NDb3VudCA9IGl0ZW0ubGFzdFBvbGxCb29rbWFya3NDb3VudDtcblxuICAgICAgICAgICAgLy8gaWYgbGFzdFBvbGxCb29rbWFya3NDb3VudCBpcyAwLCB0aGlzIGlzIG91ciBmaXJzdCB0aW1lIHBvbGxpbmdcbiAgICAgICAgICAgIC8vIHRoZSBib29rbWFya3Mgc28sIHNpbXBsZSBzdG9yZSB0aGUgcmV0dXJuIHZhbHVlIG9mIGdldEJvb2ttYXJrc0NvdW50XG4gICAgICAgICAgICBpZiAobGFzdFBvbGxCb29rbWFya3NDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHN0b3JhZ2Uuc2V0KHsgJ2xhc3RQb2xsQm9va21hcmtzQ291bnQnOiBib29rbWFya3NDb3VudCB9KTtcbiAgICAgICAgICAgICAgICAvLyBwb2xsIHRoZSBib29rbWFya3MgYWdhaW4gaW4gNSBzZWNvbmRzXG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQobW9kdWxlLmV4cG9ydHMucG9sbCwgNTAwMCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKChib29rbWFya3NDb3VudCAtIGxhc3RQb2xsQm9va21hcmtzQ291bnQpIDwgMikge1xuICAgICAgICAgICAgICAgIC8vIHNlZWluZyB0aGF0IGxhc3RQb2xsQm9va21hcmtzQ291bnQgaXMgbm8gbG9uZ2VyIDAsIHRoaXMgaXMgbm90IG91clxuICAgICAgICAgICAgICAgIC8vIGZpcnN0IHBvbGwgb2YgdGhlIGJvb2ttYXJrcy4gVGVzdCBhYm92ZSB3aGV0aGVyIHRoZSB1c2VyIGhhc1xuICAgICAgICAgICAgICAgIC8vIGFkZGVkIGxlc3MgdGhhbiBvdXIgdHJpZ2dlciBjb3VudCBzaW5jZSBsYXN0IHBvbGwsIHRoZW4gc3RvcmUgdGhlIGNvdW50LlxuICAgICAgICAgICAgICAgIHN0b3JhZ2Uuc2V0KHsgJ2xhc3RQb2xsQm9va21hcmtzQ291bnQnOiBib29rbWFya3NDb3VudCB9KTtcbiAgICAgICAgICAgICAgICAvLyBwb2xsIHRoZSBib29rbWFya3MgYWdhaW4gaW4gNSBzZWNvbmRzXG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQobW9kdWxlLmV4cG9ydHMucG9sbCwgNTAwMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoZSB1c2VyIGhhcyBhZGRlZCBtb3JlIHRoYW4gdGhlIHRyb2dnZXIgY291bnQgc28sXG4gICAgICAgICAgICAgICAgLy8gc2hvdyB0aGUgbm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignMiBvciBtb3JlIGJvb2ttYXJrcyBoYXMgYmVlbiBhZGRlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXRMYXN0UG9sbEJvb2ttYXJrc0NvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgJ2xhc3RQb2xsQm9va21hcmtzQ291bnQnOiAwIH0sIG1vZHVsZS5leHBvcnRzLm9uU3RvcmFnZVNldCk7XG4gICAgfSxcbiAgICBvblN0b3JhZ2VTZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzZXR0aW5nIHN0b3JhZ2UgaXRlbTonLCBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KGl0ZW0sIG1vZHVsZS5leHBvcnRzLm9uU3RvcmFnZVNldCk7XG4gICAgfVxufTtcbiJdfQ==
