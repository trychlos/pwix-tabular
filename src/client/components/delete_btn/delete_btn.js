/*
 * pwix:tabular/src/client/components/delete_btn/delete_btn.js
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - table: the Tabular.Table instance
 */

import { Bootbox } from 'meteor/pwix:bootbox';

import './delete_btn.html';

Template.delete_btn.helpers({
    // whether we show the disabled button
    enabledClass(){
        return this.table.opt( 'deleteButtonEnabled', true, this.item ) || !Tabular._conf.hideDisabled ? '' : 'ui-transparent';
    },

    // whether the displayed row is deletable ? defaulting to true
    enabledState(){
        return this.table.opt( 'deleteButtonEnabled', true, this.item ) ? '' : 'disabled';
    },

    // a default title
    title(){
        return this.table.opt( 'deleteButtonTitle', pwixI18n.label( I18N, 'delete.btn_title', this.item._id ), this.item );
    }
});

Template.delete_btn.events({
    'click .tabular-delete-btn button'( event, instance ){
        const self = this;
        const wantConfirmation = this.table.opt( 'wantDeleteConfirmation', true, self.item );
        if( wantConfirmation ){
            Bootbox.confirm({
                title: this.table.opt( 'deleteConfirmationTitle', pwixI18n.label( I18N, 'delete.confirm_title', self.item._id ), self.item ),
                message: this.table.opt( 'deleteConfirmationText', pwixI18n.label( I18N, 'delete.confirm_content', self.item._id ), self.item ),
                mdClassesContent: this.table.opt( 'dialogClasses', '', self.item )
            }, function( ret ){
                    if( ret ){
                        instance.$( event.currentTarget ).trigger( 'tabular-delete-event', self );
                    } else {
                        console.debug( 'user didn\'t confirm the deletion' );
                    }
                }
            );
        } else {
            instance.$( event.currentTarget ).trigger( 'tabular-delete-event', this );
        }
    }
});
