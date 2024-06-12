/*
 * pwix:tabular-ext/src/common/js/global.js
 */

import Tabular from 'meteor/aldeed:tabular';

TabularExt = class TabularExt extends Tabular.Table {

    static _addDeleteButton( o ){
        const haveButton = TabularExt.opt( 'withDeleteButton', true );
        if( haveButton ){
            o.columns.push({
                orderable: false,
                tmpl: Meteor.isClient && Template.delete_btn,
                tmplContext( rowData ){
                    return {
                        item: rowData,
                        parms: o
                    };
                }
            });
        }
    }

    static _addEditButton( o ){
        const haveButton = TabularExt.opt( 'withEditButton', true );
        if( haveButton ){
            o.columns.push({
                orderable: false,
                tmpl: Meteor.isClient && Template.edit_btn,
                tmplContext( rowData ){
                    return {
                        item: rowData,
                        parms: o
                    };
                }
            });
        }
    }

    static _addInfoButton( o ){
        const haveButton = TabularExt.opt( 'withInfoButton', true );
        if( haveButton ){
            o.columns.push({
                orderable: false,
                tmpl: Meteor.isClient && Template.info_btn,
                tmplContext( rowData ){
                    return {
                        item: rowData,
                        parms: o
                    };
                }
            });
        }
    }

    // return the value, or the value returned by the function, or the default value
    static opt( name, def, rowData ){
        let result = ( Object.keys( TabularExt.#args.tabular_ext ) || [] ).includes( name ) ? TabularExt.#args.tabular_ext[name] : def;
        return ( typeof result === 'function' ) ? result( rowData ) : result;
    }

    // whether the 'tabular_ext' template has been rendered
    static rendered = false;

    // keep the constructor args
    static #args = null;

    constructor( o ){
        TabularExt.#args = o;
        // add edition buttons unless otherwise requested
        TabularExt._addInfoButton( o );
        TabularExt._addEditButton( o );
        TabularExt._addDeleteButton( o );
        super( o );
        return this;
    }
};
