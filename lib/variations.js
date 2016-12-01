'use strict';

const prefService = require('sdk/preferences/service');

/**
 * Sets the bookmarks threshold, based on the current shield study variation
 * @param {int} choice - The variation selected
 */
exports.setVariation = function setVariation(choice) {
    // if we have not already set the preference, set it now.
    if (!prefService.has('bookmarksThreshold')) {
        prefService.set('bookmarksThreshold', choice);
    }
};
