/*
 * pwix:tabular-ext/src/client/components/edit_btn/edit_btn.js
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - parms: the TabularExt constructor arguments
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import './edit_btn.html';

Template.edit_btn.helpers({
    // whether the displayed row is deletable ? defaulting to true
    enabled(){
        let enabled = ( Object.keys( this.parms.tabular_ext ) || [] ).includes( 'editButtonEnabled' ) ? this.parms.tabular_ext.editButtonEnabled : true;
        enabled = ( typeof enabled === 'function' ) ? enabled( this.item ) : enabled;
        return enabled ? '' : 'disabled';
    },

    // a default title
    title(){
        let title = ( Object.keys( this.parms.tabular_ext ) || [] ).includes( 'editButtonTitle' ) ? this.parms.tabular_ext.editButtonTitle : pwixI18n.label( I18N, 'edit.btn_title', self.item._id );
        return ( typeof title === 'function' ) ? title( this.item ) : title;
    }
});
