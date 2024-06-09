/*
 * pwix:tabular-ext/src/common/js/global.js
 */

import Tabular from 'meteor/aldeed:tabular';

TabularExt = class TabularExt extends Tabular.Table {

    static _addDeleteButton( o ){
        const haveButton = ( Object.keys( o.tabular_ext ) || [] ).includes( 'withDeleteButton' ) ? o.tabular_ext.withDeleteButton : true;
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
        const haveButton = ( Object.keys( o.tabular_ext ) || [] ).includes( 'withEditButton' ) ? o.tabular_ext.withEditButton : true;
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
        const haveButton = ( Object.keys( o.tabular_ext ) || [] ).includes( 'withInfoButton' ) ? o.tabular_ext.withInfoButton : true;
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

    // a callback so that the three button headers are not displayed
    static _editionButtonsHeader( thead, data, start, end, display ){
        const $thead = $( thead );
        const $children = $thead.find( 'th' );
        for( let i=$children.length-3 ; i<$children.length ; ++i ){
            const $th = $children[i];
        }
    }

    static HeaderCallback( thead, data, start, end, display ){
        if( TabularExt.rendered ){
            TabularExt._editionButtonsHeader( thead, data, start, end, display );
        }
    }

    // whether the 'tabular_ext' template has been rendered
    rendered = false;

    constructor( o ){
        // add edition buttons unless otherwise requested
        TabularExt._addInfoButton( o );
        TabularExt._addEditButton( o );
        TabularExt._addDeleteButton( o );
        // have a special header for the edition buttons
        //o.headerCallback = TabularExt.HeaderCallback;
        super( o );
        return this;
    }
};
