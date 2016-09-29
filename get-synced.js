(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

let poller = require('./lib/poller.js');
let storage = require('./lib/storage.js');

(function() {
    // if lastPollBookmarksCount is undefined, initialize it to 0
    if (typeof chrome.storage.local.get('lastPollBookmarksCount') === 'undefined') {
        console.error('initialising bookmarks count in storage');
        storage.initLastPollBookmarksCount();
    }
    // start polling bookmarks
    console.error('start polling');
    poller.poll();
})();

},{"./lib/poller.js":3,"./lib/storage.js":4}],2:[function(require,module,exports){
'use strict';

module.exports = {
    bookmarksCount: 0,
    bookmarksArray: [],
    getBookmarksCount: function() {
        chrome.bookmarks.getTree(function(results) {
            console.error('got the tree', results);
            // each time getBookmarksCount is called, we want to first reset
            // the bookmarksCount back to 0 and clear the bookmarksArray
            console.error('restting counters');
            module.exports.resetCount();
            // now call treeWalker to collect all the bookmarks
            console.error('calling walker');
            module.exports.treeWalker(results, module.exports.bookmarksCount);
            console.error('Total number of bookmarks: ', module.exports.bookmarksArray.length);
            // return the length of the bookmarksArray after treeWalker completes.
            return module.exports.bookmarksArray.length;
        });
    },
    resetCount: function() {
        module.exports.bookmarksCount = 0;
        module.exports.bookmarksArray = [];
    },
    treeWalker: function(children) {
        console.error('entering walker');
        for (let entry of children) {
            console.error('walking the tree');
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
        let getLastPollBookmarksCount = browser.storage.local.get('lastPollBookmarksCount');

        getLastPollBookmarksCount.then(function(item, logError) {
            console.error('got getLastPollBookmarksCount', item);
            if (logError) {
                console.error('Error getting storage item:', chrome.runtime.lastError);
                return;
            }

            console.error('getting live bookmarks count');
            let bookmarksCount = bookmarksCounter.getBookmarksCount();
            console.error('got live bookmarks count', bookmarksCount);
            let lastPollBookmarksCount = item.lastPollBookmarksCount;
            console.error('lastPollBookmarksCount', lastPollBookmarksCount);

            // if lastPollBookmarksCount is 0, this is our first time polling
            // the bookmarks so, simple store the return value of getBookmarksCount
            if (lastPollBookmarksCount === 0) {
                console.error('This is the first time, setting the count to', bookmarksCount);
                storage.set({ 'lastPollBookmarksCount': bookmarksCount });
                // poll the bookmarks again in 5 seconds
                console.error('setting timeout to call poll again in 5 seconds');
                window.setTimeout(module.exports.poll, 5000);
            } else if ((bookmarksCount - lastPollBookmarksCount) < 2) {
                console.error('less than two bookmarks');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImluZGV4LmpzIiwibGliL2Jvb2ttYXJrcy1jb3VudGVyLmpzIiwibGliL3BvbGxlci5qcyIsImxpYi9zdG9yYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5sZXQgcG9sbGVyID0gcmVxdWlyZSgnLi9saWIvcG9sbGVyLmpzJyk7XG5sZXQgc3RvcmFnZSA9IHJlcXVpcmUoJy4vbGliL3N0b3JhZ2UuanMnKTtcblxuKGZ1bmN0aW9uKCkge1xuICAgIC8vIGlmIGxhc3RQb2xsQm9va21hcmtzQ291bnQgaXMgdW5kZWZpbmVkLCBpbml0aWFsaXplIGl0IHRvIDBcbiAgICBpZiAodHlwZW9mIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnbGFzdFBvbGxCb29rbWFya3NDb3VudCcpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdpbml0aWFsaXNpbmcgYm9va21hcmtzIGNvdW50IGluIHN0b3JhZ2UnKTtcbiAgICAgICAgc3RvcmFnZS5pbml0TGFzdFBvbGxCb29rbWFya3NDb3VudCgpO1xuICAgIH1cbiAgICAvLyBzdGFydCBwb2xsaW5nIGJvb2ttYXJrc1xuICAgIGNvbnNvbGUuZXJyb3IoJ3N0YXJ0IHBvbGxpbmcnKTtcbiAgICBwb2xsZXIucG9sbCgpO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgYm9va21hcmtzQ291bnQ6IDAsXG4gICAgYm9va21hcmtzQXJyYXk6IFtdLFxuICAgIGdldEJvb2ttYXJrc0NvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2hyb21lLmJvb2ttYXJrcy5nZXRUcmVlKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2dvdCB0aGUgdHJlZScsIHJlc3VsdHMpO1xuICAgICAgICAgICAgLy8gZWFjaCB0aW1lIGdldEJvb2ttYXJrc0NvdW50IGlzIGNhbGxlZCwgd2Ugd2FudCB0byBmaXJzdCByZXNldFxuICAgICAgICAgICAgLy8gdGhlIGJvb2ttYXJrc0NvdW50IGJhY2sgdG8gMCBhbmQgY2xlYXIgdGhlIGJvb2ttYXJrc0FycmF5XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdyZXN0dGluZyBjb3VudGVycycpO1xuICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMucmVzZXRDb3VudCgpO1xuICAgICAgICAgICAgLy8gbm93IGNhbGwgdHJlZVdhbGtlciB0byBjb2xsZWN0IGFsbCB0aGUgYm9va21hcmtzXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdjYWxsaW5nIHdhbGtlcicpO1xuICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMudHJlZVdhbGtlcihyZXN1bHRzLCBtb2R1bGUuZXhwb3J0cy5ib29rbWFya3NDb3VudCk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUb3RhbCBudW1iZXIgb2YgYm9va21hcmtzOiAnLCBtb2R1bGUuZXhwb3J0cy5ib29rbWFya3NBcnJheS5sZW5ndGgpO1xuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBsZW5ndGggb2YgdGhlIGJvb2ttYXJrc0FycmF5IGFmdGVyIHRyZWVXYWxrZXIgY29tcGxldGVzLlxuICAgICAgICAgICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzLmJvb2ttYXJrc0FycmF5Lmxlbmd0aDtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZXNldENvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMuYm9va21hcmtzQ291bnQgPSAwO1xuICAgICAgICBtb2R1bGUuZXhwb3J0cy5ib29rbWFya3NBcnJheSA9IFtdO1xuICAgIH0sXG4gICAgdHJlZVdhbGtlcjogZnVuY3Rpb24oY2hpbGRyZW4pIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignZW50ZXJpbmcgd2Fsa2VyJyk7XG4gICAgICAgIGZvciAobGV0IGVudHJ5IG9mIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCd3YWxraW5nIHRoZSB0cmVlJyk7XG4gICAgICAgICAgICBpZiAoZW50cnkudXJsKSB7XG4gICAgICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMuYm9va21hcmtzQXJyYXkucHVzaChlbnRyeSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlbnRyeS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGVudHJ5LmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzLmJvb2ttYXJrc0FycmF5LnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtb2R1bGUuZXhwb3J0cy50cmVlV2Fsa2VyKGVudHJ5LmNoaWxkcmVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmxldCBib29rbWFya3NDb3VudGVyID0gcmVxdWlyZSgnLi9ib29rbWFya3MtY291bnRlci5qcycpO1xubGV0IHN0b3JhZ2UgPSByZXF1aXJlKCcuL3N0b3JhZ2UuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcG9sbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBnZXRMYXN0UG9sbEJvb2ttYXJrc0NvdW50ID0gYnJvd3Nlci5zdG9yYWdlLmxvY2FsLmdldCgnbGFzdFBvbGxCb29rbWFya3NDb3VudCcpO1xuXG4gICAgICAgIGdldExhc3RQb2xsQm9va21hcmtzQ291bnQudGhlbihmdW5jdGlvbihpdGVtLCBsb2dFcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZ290IGdldExhc3RQb2xsQm9va21hcmtzQ291bnQnLCBpdGVtKTtcbiAgICAgICAgICAgIGlmIChsb2dFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgc3RvcmFnZSBpdGVtOicsIGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdnZXR0aW5nIGxpdmUgYm9va21hcmtzIGNvdW50Jyk7XG4gICAgICAgICAgICBsZXQgYm9va21hcmtzQ291bnQgPSBib29rbWFya3NDb3VudGVyLmdldEJvb2ttYXJrc0NvdW50KCk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdnb3QgbGl2ZSBib29rbWFya3MgY291bnQnLCBib29rbWFya3NDb3VudCk7XG4gICAgICAgICAgICBsZXQgbGFzdFBvbGxCb29rbWFya3NDb3VudCA9IGl0ZW0ubGFzdFBvbGxCb29rbWFya3NDb3VudDtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2xhc3RQb2xsQm9va21hcmtzQ291bnQnLCBsYXN0UG9sbEJvb2ttYXJrc0NvdW50KTtcblxuICAgICAgICAgICAgLy8gaWYgbGFzdFBvbGxCb29rbWFya3NDb3VudCBpcyAwLCB0aGlzIGlzIG91ciBmaXJzdCB0aW1lIHBvbGxpbmdcbiAgICAgICAgICAgIC8vIHRoZSBib29rbWFya3Mgc28sIHNpbXBsZSBzdG9yZSB0aGUgcmV0dXJuIHZhbHVlIG9mIGdldEJvb2ttYXJrc0NvdW50XG4gICAgICAgICAgICBpZiAobGFzdFBvbGxCb29rbWFya3NDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoaXMgaXMgdGhlIGZpcnN0IHRpbWUsIHNldHRpbmcgdGhlIGNvdW50IHRvJywgYm9va21hcmtzQ291bnQpO1xuICAgICAgICAgICAgICAgIHN0b3JhZ2Uuc2V0KHsgJ2xhc3RQb2xsQm9va21hcmtzQ291bnQnOiBib29rbWFya3NDb3VudCB9KTtcbiAgICAgICAgICAgICAgICAvLyBwb2xsIHRoZSBib29rbWFya3MgYWdhaW4gaW4gNSBzZWNvbmRzXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignc2V0dGluZyB0aW1lb3V0IHRvIGNhbGwgcG9sbCBhZ2FpbiBpbiA1IHNlY29uZHMnKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChtb2R1bGUuZXhwb3J0cy5wb2xsLCA1MDAwKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKGJvb2ttYXJrc0NvdW50IC0gbGFzdFBvbGxCb29rbWFya3NDb3VudCkgPCAyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignbGVzcyB0aGFuIHR3byBib29rbWFya3MnKTtcbiAgICAgICAgICAgICAgICAvLyBzZWVpbmcgdGhhdCBsYXN0UG9sbEJvb2ttYXJrc0NvdW50IGlzIG5vIGxvbmdlciAwLCB0aGlzIGlzIG5vdCBvdXJcbiAgICAgICAgICAgICAgICAvLyBmaXJzdCBwb2xsIG9mIHRoZSBib29rbWFya3MuIFRlc3QgYWJvdmUgd2hldGhlciB0aGUgdXNlciBoYXNcbiAgICAgICAgICAgICAgICAvLyBhZGRlZCBsZXNzIHRoYW4gb3VyIHRyaWdnZXIgY291bnQgc2luY2UgbGFzdCBwb2xsLCB0aGVuIHN0b3JlIHRoZSBjb3VudC5cbiAgICAgICAgICAgICAgICBzdG9yYWdlLnNldCh7ICdsYXN0UG9sbEJvb2ttYXJrc0NvdW50JzogYm9va21hcmtzQ291bnQgfSk7XG4gICAgICAgICAgICAgICAgLy8gcG9sbCB0aGUgYm9va21hcmtzIGFnYWluIGluIDUgc2Vjb25kc1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KG1vZHVsZS5leHBvcnRzLnBvbGwsIDUwMDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0aGUgdXNlciBoYXMgYWRkZWQgbW9yZSB0aGFuIHRoZSB0cm9nZ2VyIGNvdW50IHNvLFxuICAgICAgICAgICAgICAgIC8vIHNob3cgdGhlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJzIgb3IgbW9yZSBib29rbWFya3MgaGFzIGJlZW4gYWRkZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0TGFzdFBvbGxCb29rbWFya3NDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7ICdsYXN0UG9sbEJvb2ttYXJrc0NvdW50JzogMCB9LCBtb2R1bGUuZXhwb3J0cy5vblN0b3JhZ2VTZXQpO1xuICAgIH0sXG4gICAgb25TdG9yYWdlU2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igc2V0dGluZyBzdG9yYWdlIGl0ZW06JywgY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldChpdGVtLCBtb2R1bGUuZXhwb3J0cy5vblN0b3JhZ2VTZXQpO1xuICAgIH1cbn07XG4iXX0=
