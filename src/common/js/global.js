/*
 * pwix:tabular-ext/src/common/js/global.js
 */

import Tabular from 'meteor/aldeed:tabular';

TabularExt = class TabularExt extends Tabular.Table {

    // define the three columns for the edition buttons
    static EditionButtons = [
        { data: 'infoBtn',
          orderable: false,
          render: function(){ return '<button class="btn btn-sm ca-transparent" disabled><span class="fa-solid fa-fw fa-minus"></span></button>'; }
        },
        { data: 'editBtn',
          orderable: false,
          render: function(){ return '<button class="btn btn-sm btn-outline-primary" disabled><span class="fa-solid fa-fw fa-pen-to-square"></span></button>'; }
        },
        { data: 'deleteBtn',
          orderable: false,
          render: function(){ return '<button class="btn btn-sm btn-outline-primary" disabled><span class="fa-solid fa-fw fa-trash"></span></button>'; }
        }
    ];

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
        // add the edition buttons
        o.columns = o.columns.concat( TabularExt.EditionButtons );
        // have a special header for the edition buttons
        o.headerCallback = TabularExt.HeaderCallback;
        super( o );
        return this;
    }
};
