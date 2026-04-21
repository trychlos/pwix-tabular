/*
 * pwix:tabular/src/common/js/functions.js
 */

import { check, Match } from 'meteor/check';

/**
 * @param {String} name the tabular name
 * @returns {Array|undefined} the names to be visible on the named tabular
 */
Tabular.getSettingsColumns = function( tabularName ){
    check( tabularName, Match.NonEmptyString );
    let names;
    if( Meteor.isClient ){
        const str = Tabular._store.get( COOKIE_COLUMNS, tabularName );
        if( str ){
            names = str.split( /,/ );
        }
    }
    return names;
}

/**
 * @param {Array} columns the original columns as returned by fieldset.toTabular() method
 * @returns {Object} a map of these terminal names to index
 */
Tabular.indexMap = function( columns ){
    check( columns, Array );
    let map = {};
    for( const it of columns ){
        map[it.name] = it.index;
    }
    return map;
}
