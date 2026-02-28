/*
 * pwix:tabular/src/client/components/tabular_ext/tabular_ext.js
 */

import { Logger } from 'meteor/pwix:logger';

import './tabular_ext.html';

const logger = Logger.get();

Template.tabular_ext.onRendered( function(){
    const self = this;

    // when inside a tab, and initially hidden, Datatables cannot calculate its own width
    //  see https://stackoverflow.com/questions/604933/jquery-datatables-control-table-width#5344203
    // so force that when displaying
    //  see https://stackoverflow.com/questions/1462138/event-listener-for-when-element-becomes-visible
    // Start observing visbility of element. On change, the callback is called with Boolean visibility as argument:
    function respondToVisibility( element, callback ){
        const observer = new IntersectionObserver(( entries, observer ) => {
            entries.forEach(( entry ) => {
                //logger.debug( 'entry', entry, 'entry.intersectionRatio', entry.intersectionRatio );
                callback( entry.intersectionRatio > 0 );
            });
        });
        observer.observe( element );
    }

    const $node = self.$( '.TabularExt table.dataTable');
    if( $node && $node.length ){
        const cb = function( visible ){
            //logger.debug( 'callback visible', visible );
            if( visible ){
                // seems that dtApi is of no rescue here
                //const dtApi = $node.DataTable();
                //logger.debug( 'dtApi', dtApi );
                //dtApi.responsive.recalc(); inoperant in the case
                //dtApi.columns.adjust(); inoperant in the case

                // eventually just try to remove the width attribute - which happens to works
                //logger.debug( 'width', $node.width());
                $node.width( '' );
            }
        };
        respondToVisibility( $node[0], cb );
    }

    // advertise the class instance of the rendering state
    //Template.currentData().table.rendered( true );

    // aldeed:meteor-tabular creates the table.dataTable when rendering
    // this code runs and let us access the data of a child Blaze view - but useless atm
    /*
    self.autorun(() => {
        const node = self.find( 'table.dataTable' );
        if( node ){
            let view = Blaze.getView( node );
            // Walk up until we find the template view
            while( view && !view.name.startsWith( 'Template.' )){
                view = view.parentView;
            }
            const instance = view && view.templateInstance();
        }
    });
    */
});
