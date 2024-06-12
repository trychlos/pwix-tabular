/*
 * pwix:tabular-ext/src/client/components/delete_btn/delete_btn.js
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - parms: the TabularExt constructor arguments
 */

import { Bootbox } from 'meteor/pwix:bootbox';

import './delete_btn.html';

Template.delete_btn.helpers({
    // whether the displayed row is deletable ? defaulting to true
    enabled(){
        return TabularExt.opt( 'deleteButtonEnabled', true, this.item ) ? '' : 'disabled';
    },

    // a default title
    title(){
        return TabularExt.opt( 'deleteButtonTitle', pwixI18n.label( I18N, 'delete.btn_title', this.item._id ), this.item );
    }
});

Template.delete_btn.events({
    'click .ext-delete-btn button'( event, instance ){
        const self = this;
        const wantConfirmation = TabularExt.opt( 'wantDeleteConfirmation', true, self.item );
        if( wantConfirmation ){
            Bootbox.confirm({
                title: TabularExt.opt( 'deleteConfirmationTitle', pwixI18n.label( I18N, 'delete.confirm_title', self.item._id ), self.item ),
                message: TabularExt.opt( 'deleteConfirmationText', pwixI18n.label( I18N, 'delete.confirm_content', self.item._id ), self.item ),
                mdClassesContent: TabularExt.opt( 'dialogClasses', '', self.item )
            }, function( ret ){
                    if( ret ){
                        instance.$( event.currentTarget ).trigger( 'tabular-ext-delete-event', self );
                    } else {
                        console.debug( 'user didn\'t confirm the deletion' );
                    }
                }
            );
        } else {
            instance.$( event.currentTarget ).trigger( 'tabular-ext-delete-event', this );
        }
    }
});
