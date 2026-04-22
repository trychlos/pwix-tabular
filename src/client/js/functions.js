/*
 * pwix:tabular/src/client/js/functions.js
 *
 * Note that we cannot really reluy on 'init.dt' end of DataTable initialization event as it may be triggered early enough in the process
 * And the TabularExt template may not be yet rendered. So Have tio use initComplete() DataTable option which is also used by 'aldeed:tabular'
 */

import { check, Match } from 'meteor/check';
import { Logger } from 'meteor/pwix:logger';

const logger = Logger.get();

/**
 * @param {String} tabularName the tabular name
 * @param {dtApi} dtTable the DataTable dtApi entry point
 */
Tabular.applyState = function( tabularName, dtTable ){
    check( tabularName, Match.NonEmptyString );

    // apply state from settings (if any)
    // order and visibility of the columns
    const _applyColumnsState = function( dtTable, tabularTable ){
        const columns = tabularTable.options.columns;
        const indexMap = Tabular.indexMap( columns );
        const settings = Tabular.getSettingsColumns( tabularName );
        if( settings ){
            const allNames = columns.map(( it ) => it.name );
            // apply ordering
            const otherColumns = columns.filter(( it ) => !settings.includes( it.name ));
            const order = settings.map(( name ) => indexMap[name] );
            for( const it of otherColumns ){
                order.push( it.index );
            }
            dtTable.colReorder.order( order );
            //logger.debug( 'columns', columns, 'settings', settings, 'order', order );
            // apply visibility
            for( const it of columns ){
                const visible = settings.includes( it.name )
                dtTable.column( it.name+':name' ).visible( visible, false );
            }
            // finalize
            dtTable.columns.adjust().draw( false );
        }
    };

    // apply state from settings (if any)
    const _applyRowsState = function( dtTable, tabularTable ){
    };

    const tabularTable = Package['aldeed:tabular'].default.tablesByName[tabularName];
    //logger.debug( 'tabularName', tabularName, 'dtTable', dtTable, 'tabularTable', tabularTable );
    _applyColumnsState( dtTable, tabularTable );
    _applyRowsState( dtTable, tabularTable );
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
