/*
 * pwix:tabular/src/client/components/edit_btn/edit_btn.js
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - table: the Tabular.Table instance
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import './edit_btn.html';

Template.edit_btn.helpers({
    // whether the displayed row is deletable ? defaulting to true
    enabled(){
        return this.table.opt( 'editButtonEnabled', true, this.item ) ? '' : 'disabled';
    },

    // a default title
    title(){
        return this.table.opt( 'editButtonTitle', pwixI18n.label( I18N, 'edit.btn_title', this.item._id ), this.item );
    }
});

Template.edit_btn.events({
    'click .tabular-edit-btn button'( event, instance ){
        instance.$( event.currentTarget ).trigger( 'tabular-edit-event', this );
    }
});
