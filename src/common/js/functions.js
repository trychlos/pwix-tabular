/*
 * pwix:tabular/src/common/js/functions.js
 */

/**
 * @param {String} name the tabular name
 * @returns {Array|undefined} the names to be visible on the named tabular
 */
Tabular.getSettingsColumns = function( name ){
    let names;
    if( Meteor.isClient ){
        const str = Tabular._store.get( COOKIE_COLUMNS, name );
        if( str ){
            names = str.split( /,/ );
        }
    }
    return names;
}
