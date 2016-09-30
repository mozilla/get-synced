(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

let poller = require('./lib/poller.js');

(function() {
    // start polling bookmarks
    poller.poll();
})();

},{"./lib/poller.js":3}],2:[function(require,module,exports){
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

let bookmarksCounter = require('./bookmarks-counter.js');
let popup = require('./popup.js');
let storage = require('./storage.js');

module.exports = {
    poll: function() {
        const newBookmarksThreshold = 2;
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
                    storage.set({
                        'originalBookmarksCount': bookmarksCounter.getAllBookmarksCount(results)
                    });
                    window.setTimeout(module.exports.poll, 5000);
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
                            window.setTimeout(module.exports.poll, 5000);
                        } else {
                            popup.showPopup();
                        }
                    });
                }
            });
        });
    }
};

},{"./bookmarks-counter.js":2,"./popup.js":4,"./storage.js":5}],4:[function(require,module,exports){
'use strict';

module.exports = {
    showPopup: function() {
        let popupURL = chrome.extension.getURL('ui/pop-up.html');

        chrome.windows.create({
            url: popupURL,
            type: 'popup',
            width: 200,
            height: 200
        }, function(window) {
            console.error('popup opened', window);
        });
    }
};

},{}],5:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImluZGV4LmpzIiwibGliL2Jvb2ttYXJrcy1jb3VudGVyLmpzIiwibGliL3BvbGxlci5qcyIsImxpYi9wb3B1cC5qcyIsImxpYi9zdG9yYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5sZXQgcG9sbGVyID0gcmVxdWlyZSgnLi9saWIvcG9sbGVyLmpzJyk7XG5cbihmdW5jdGlvbigpIHtcbiAgICAvLyBzdGFydCBwb2xsaW5nIGJvb2ttYXJrc1xuICAgIHBvbGxlci5wb2xsKCk7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBib29rbWFya3NDb3VudDogMCxcbiAgICBib29rbWFya3NBcnJheTogW10sXG4gICAgZ2V0QWxsQm9va21hcmtzQ291bnQ6IGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgLy8gZWFjaCB0aW1lIGdldEJvb2ttYXJrc0NvdW50IGlzIGNhbGxlZCwgd2Ugd2FudCB0byBmaXJzdCByZXNldFxuICAgICAgICAvLyB0aGUgYm9va21hcmtzQ291bnQgYmFjayB0byAwIGFuZCBjbGVhciB0aGUgYm9va21hcmtzQXJyYXlcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMucmVzZXRDb3VudCgpO1xuICAgICAgICAvLyBub3cgY2FsbCB0cmVlV2Fsa2VyIHRvIGNvbGxlY3QgYWxsIHRoZSBib29rbWFya3NcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMudHJlZVdhbGtlcihyZXN1bHRzLCBtb2R1bGUuZXhwb3J0cy5ib29rbWFya3NDb3VudCk7XG4gICAgICAgIHJldHVybiBtb2R1bGUuZXhwb3J0cy5ib29rbWFya3NBcnJheS5sZW5ndGg7XG4gICAgfSxcbiAgICByZXNldENvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMuYm9va21hcmtzQ291bnQgPSAwO1xuICAgICAgICBtb2R1bGUuZXhwb3J0cy5ib29rbWFya3NBcnJheSA9IFtdO1xuICAgIH0sXG4gICAgdHJlZVdhbGtlcjogZnVuY3Rpb24oY2hpbGRyZW4pIHtcbiAgICAgICAgZm9yIChsZXQgZW50cnkgb2YgY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmIChlbnRyeS51cmwgJiYgZW50cnkudXJsLmluZGV4T2YoJ3BsYWNlczonKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBtb2R1bGUuZXhwb3J0cy5ib29rbWFya3NBcnJheS5wdXNoKGVudHJ5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVudHJ5LmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMudHJlZVdhbGtlcihlbnRyeS5jaGlsZHJlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5sZXQgYm9va21hcmtzQ291bnRlciA9IHJlcXVpcmUoJy4vYm9va21hcmtzLWNvdW50ZXIuanMnKTtcbmxldCBwb3B1cCA9IHJlcXVpcmUoJy4vcG9wdXAuanMnKTtcbmxldCBzdG9yYWdlID0gcmVxdWlyZSgnLi9zdG9yYWdlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHBvbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBuZXdCb29rbWFya3NUaHJlc2hvbGQgPSAyO1xuICAgICAgICBsZXQgYWxsQm9va21hcmtzVHJlZSA9IGJyb3dzZXIuYm9va21hcmtzLmdldFRyZWUoKTtcblxuICAgICAgICBhbGxCb29rbWFya3NUcmVlLnRoZW4oZnVuY3Rpb24ocmVzdWx0cywgbG9nRXJyb3IpIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIHdhcyBhbiBlcnJvciwgbG9nIGl0IGFuZCByZXR1cm4gaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIGlmIChsb2dFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgY3VycmVudCBib29rbWFya3MgY291bnQnLCBsb2dFcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYm9va21hcmtzVHJlZSA9IHJlc3VsdHM7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ29yaWdpbmFsQm9va21hcmtzQ291bnQnLCBmdW5jdGlvbihjb3VudGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIG9yaWdpbmFsIGJvb2ttYXJrcyBjb3VudCcsIGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBvcmlnaW5hbEJvb2ttYXJrc0NvdW50IGlzIHVuZGVmaW5lZCwgdGhpcyBpcyB0aGUgZmlyc3QgaXRlcmF0aW9uLiBTdG9yZVxuICAgICAgICAgICAgICAgIC8vIHRoZSBjdXJyZW50IG51bWJlciBvZiBib29rbWFya3MgYW5kIHNldCBhIHRpbWVvdXQgZm9yIDUgc2Vjb25kcy5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvdW50ZXIub3JpZ2luYWxCb29rbWFya3NDb3VudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmFnZS5zZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ29yaWdpbmFsQm9va21hcmtzQ291bnQnOiBib29rbWFya3NDb3VudGVyLmdldEFsbEJvb2ttYXJrc0NvdW50KHJlc3VsdHMpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChtb2R1bGUuZXhwb3J0cy5wb2xsLCA1MDAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZ2V0T3JpZ2luYWxCb29rbWFya3NDb3VudCA9IGJyb3dzZXIuc3RvcmFnZS5sb2NhbC5nZXQoJ29yaWdpbmFsQm9va21hcmtzQ291bnQnKTtcbiAgICAgICAgICAgICAgICAgICAgZ2V0T3JpZ2luYWxCb29rbWFya3NDb3VudC50aGVuKGZ1bmN0aW9uKGl0ZW0sIGxvZ0Vycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSB3YXMgYW4gZXJyb3IsIGxvZyBpdCBhbmQgcmV0dXJuIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9nRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIG9yaWdpbmFsIGJvb2ttYXJrcyBjb3VudCcsIGxvZ0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsYXRlc3RCb29rbWFya3NDb3VudCA9IGJvb2ttYXJrc0NvdW50ZXIuZ2V0QWxsQm9va21hcmtzQ291bnQoYm9va21hcmtzVHJlZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3Qm9va21hcmtzQ291bnQgPSAgbGF0ZXN0Qm9va21hcmtzQ291bnQgLSBpdGVtLm9yaWdpbmFsQm9va21hcmtzQ291bnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGhhdmUgbm90IHJlYWNoZWQgb3VyIHRocmVzaG9sZCB5ZXQsIHNldFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYSBuZXcgdGltZW91dC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdCb29rbWFya3NDb3VudCA8IG5ld0Jvb2ttYXJrc1RocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KG1vZHVsZS5leHBvcnRzLnBvbGwsIDUwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5zaG93UG9wdXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHNob3dQb3B1cDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBwb3B1cFVSTCA9IGNocm9tZS5leHRlbnNpb24uZ2V0VVJMKCd1aS9wb3AtdXAuaHRtbCcpO1xuXG4gICAgICAgIGNocm9tZS53aW5kb3dzLmNyZWF0ZSh7XG4gICAgICAgICAgICB1cmw6IHBvcHVwVVJMLFxuICAgICAgICAgICAgdHlwZTogJ3BvcHVwJyxcbiAgICAgICAgICAgIHdpZHRoOiAyMDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDIwMFxuICAgICAgICB9LCBmdW5jdGlvbih3aW5kb3cpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3BvcHVwIG9wZW5lZCcsIHdpbmRvdyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIG9uU3RvcmFnZVNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHNldHRpbmcgc3RvcmFnZSBpdGVtOicsIGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoaXRlbSwgbW9kdWxlLmV4cG9ydHMub25TdG9yYWdlU2V0KTtcbiAgICB9XG59O1xuIl19
