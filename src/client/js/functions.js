/*
 * pwix:tabular/src/client/js/functions.js
 */

import { check, Match } from 'meteor/check';
import { Logger } from 'meteor/pwix:logger';

const logger = Logger.get();

/**
 * @param {String} tabularName the tabular name
 * @param {String} selector the parent selector to be sure to intercept the initialization message
 * @param {Object} opts an optional options object, with follwoing keys:
 *  - first: whether to wait for init message, defaulting to false
 */
Tabular.applyColumnsState = function( tabularName, selector, opts={} ){
    check( tabularName, Match.NonEmptyString );
    check( selector, Match.NonEmptyString );

    // apply state from settings (if any)
    const _applyState = function(){
        const $table = $( selector ).find( 'table.dataTable' );
        const dtTable = $table.DataTable();
        const tabularTable = Package['aldeed:tabular'].default.tablesByName[tabularName];
        const columns = tabularTable.options.columns;
        const indexMap = Tabular.indexMap( columns );
        const settings = Tabular.getSettingsColumns( tabularName );
        logger.debug( 'columns', columns, 'settings', settings );
        if( settings ){
            const allNames = columns.map(( it ) => it.name );
            // apply ordering
            const otherColumns = columns.filter(( it ) => !settings.includes( it.name ));
            logger.debug( 'otherColumns', otherColumns );
            const order = settings.map(( name ) => indexMap[name] );
            for( const it of otherColumns ){
                order.push( it.index );
            }
            logger.debug( 'order', order );
            dtTable.colReorder.order( order );
            // apply visibility
            for( const it of columns ){
                const visible = settings.includes( it.name )
                dtTable.column( it.name+':name' ).visible( visible, false );
            }
            // finalize
            dtTable.columns.adjust().draw( false );
        }
    };

    if( opts.first ){
        const $parent = $( selector );
        $parent.one( 'init.dt', function(){
            _applyState();
        });
    } else {
        _applyState();
    }
}

/**
 * @param {String} tabularName the tabular name
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
