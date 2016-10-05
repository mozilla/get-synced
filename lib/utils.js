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
