/*
 * pwix:tabular/src/common/js/functions.js
 */

import _ from 'lodash';

import { check, Match } from 'meteor/check';
import { Logger } from 'meteor/pwix:logger';

const logger = Logger.get();

/**
 * @param {Array} columns the original columns as returned by fieldset.toTabular() method
 * @returns {Object} a map of these terminal names to index
 */
Tabular.indexMap = function( columns ){
    check( columns, Array );
    let map = {};
    let idx = 0;
    for( const it of columns ){
        map[it.name] = idx++;
    }
    return map;
}
