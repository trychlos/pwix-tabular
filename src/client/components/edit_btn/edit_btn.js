/*
 * pwix:tabular/src/client/components/edit_btn/edit_btn.js
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - table: the Tabular.Table instance
 */

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './edit_btn.html';

Template.edit_btn.onCreated( function(){
    const self = this;

    self.PCK = {
        item: new ReactiveVar( null ),
        enabled: new ReactiveVar( true ),
        title: new ReactiveVar( '' )
    };
});

Template.edit_btn.onRendered( function(){
    const self = this;

    // get asynchronously the item
    self.autorun(() => {
        const dc = Template.currentData();
        if( dc.item && dc.table ){
            dc.table.opt( 'editItem', dc.item, dc.item ).then(( res ) => { self.PCK.item.set( res ); });
       }
    });

    // get asynchronously the enabled state
    self.autorun(() => {
        const dc = Template.currentData();
        if( dc.item && dc.table ){
            dc.table.opt( 'editButtonEnabled', true, dc.item ).then(( res ) => { self.PCK.enabled.set( res ); });
        }
    });

    // get asynchronously the button title
    self.autorun(() => {
        const dc = Template.currentData();
        if( dc.item && dc.table ){
            dc.table.opt( 'editButtonTitle', pwixI18n.label( I18N, 'edit.btn_title', dc.item._id ), dc.item ).then(( res ) => { self.PCK.title.set( res ); });
        }
    });
});

Template.edit_btn.helpers({
    // whether to show the disabled button ?
    enabledClass(){
        return Template.instance().PCK.enabled.get() || !Tabular.configure().hideDisabled ? '' : 'ui-transparent';
    },

    // whether the displayed row is deletable ? defaulting to true
    enabledState(){
        return Template.instance().PCK.enabled.get() ? '' : 'disabled';
    },

    // a default title
    title(){
        return Template.instance().PCK.title.get();
    }
});

Template.edit_btn.events({
    async 'click .tabular-edit-btn button'( event, instance ){
        const item = instance.PCK.item.get();
        this.item = item;
        instance.$( event.currentTarget ).trigger( 'tabular-edit-event', this );
    }
});
