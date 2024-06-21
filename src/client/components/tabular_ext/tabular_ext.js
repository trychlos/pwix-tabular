/*
 * pwix:tabular/src/client/components/tabular_ext/tabular_ext.js
 */

import './tabular_ext.html';

Template.tabular_ext.onRendered( function(){
    Template.currentData().table.rendered( true );
});
