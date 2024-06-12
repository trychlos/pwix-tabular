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
        return TabularExt.opt( 'editButtonEnabled', true, this.item ) ? '' : 'disabled';
    },

    // a default title
    title(){
        return TabularExt.opt( 'editButtonTitle', pwixI18n.label( I18N, 'edit.btn_title', this.item._id ), this.item );
    }
});

Template.edit_btn.events({
    'click .ext-edit-btn button'( event, instance ){
        instance.$( event.currentTarget ).trigger( 'tabular-ext-edit-event', this );
    }
});
