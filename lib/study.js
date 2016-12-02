'use strict';

const self = require('sdk/self');
const shield = require('shield-studies-addon-utils');
const variationUtils = require('./variations');

const studyConfig = {
    name: self.addonId,
    days: 14,
    variations: {
        'bookmarks-low': () => variationUtils.setVariation(1),
        'bookmarks-mid': () => variationUtils.setVariation(3),
        'bookmarks-high': () => variationUtils.setVariation(5)
    }
};

class bookmarksStudy extends shield.Study {
    constructor(config) {
        super(config);
    }
}

const thisStudy = new bookmarksStudy(studyConfig);

exports.study = thisStudy;
