/*
 * pwix:tabular-ext/src/client/components/delete_btn/delete_btn.js
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - parms: the TabularExt constructor arguments
 */

import './delete_btn.html';

Template.delete_btn.helpers({
    // whether the displayed row is deletable ? defaulting to true
    enabled(){
        let enabled = ( Object.keys( this.parms.tabular_ext ) || [] ).includes( 'deleteButtonEnabled' ) ? this.parms.tabular_ext.deleteButtonEnabled : true;
        enabled = ( typeof enabled === 'function' ) ? enabled( this.item ) : enabled;
        return enabled ? '' : 'disabled';
    },

    // a default title
    title(){
        let title = ( Object.keys( this.parms.tabular_ext ) || [] ).includes( 'deleteButtonTitle' ) ? this.parms.tabular_ext.deleteButtonTitle : pwixI18n.label( I18N, 'delete.btn_title', self.item._id );
        return ( typeof title === 'function' ) ? title( this.item ) : title;
    }
});
