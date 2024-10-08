/*
 * pwix:tabular/src/client/components/delete_btn/delete_btn.js
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - table: the Tabular.Table instance
 */

import { Bootbox } from 'meteor/pwix:bootbox';
import { ReactiveVar } from 'meteor/reactive-var';

import './delete_btn.html';

Template.delete_btn.onCreated( function(){
    const self = this;

    self.PCK = {
        item: new ReactiveVar( null ),
        enabled: new ReactiveVar( true ),
        button_title: new ReactiveVar( '' )
    };
});

Template.delete_btn.onRendered( function(){
    const self = this;

    // get asynchronously the item
    self.autorun(() => {
        const dc = Template.currentData();
        if( dc.item && dc.table ){
            dc.table.opt( 'deleteItem', dc.item, dc.item ).then(( res ) => { self.PCK.item.set( res ); });
        }
    });

    // get asynchronously the enabled state
    self.autorun(() => {
        const dc = Template.currentData();
        if( dc.item && dc.table ){
            dc.table.opt( 'deleteButtonEnabled', true, dc.item ).then(( res ) => { self.PCK.enabled.set( res ); });
        }
    });

    // get asynchronously the button title
    self.autorun(() => {
        const dc = Template.currentData();
        if( dc.item && dc.table ){
            dc.table.opt( 'deleteButtonTitle', pwixI18n.label( I18N, 'delete.btn_title', dc.item._id ), dc.item ).then(( res ) => { self.PCK.button_title.set( res ); });
        }
    });
});

Template.delete_btn.helpers({
    // whether we show the disabled button
    enabledClass(){
        return Template.instance().PCK.enabled.get() || !Tabular.configure().hideDisabled ? '' : 'ui-transparent';
    },

    // whether the displayed row is deletable ? defaulting to true
    enabledState(){
        return Template.instance().PCK.enabled.get() ? '' : 'disabled';
    },

    // a default title
    title(){
        return Template.instance().PCK.button_title.get();
    }
});

Template.delete_btn.events({
    async 'click .tabular-delete-btn button'( event, instance ){
        const self = this;
        const item = instance.PCK.item.get();
        const wantConfirmation = this.table.opt( 'wantDeleteConfirmation', true, item );
        if( wantConfirmation ){
            Bootbox.confirm({
                title: await this.table.opt( 'deleteConfirmationTitle', pwixI18n.label( I18N, 'delete.confirm_title', item._id ), item ),
                message: await this.table.opt( 'deleteConfirmationText', pwixI18n.label( I18N, 'delete.confirm_content', item._id ), item ),
                mdClassesContent: await this.table.opt( 'dialogClasses', '', item )
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
