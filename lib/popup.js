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
