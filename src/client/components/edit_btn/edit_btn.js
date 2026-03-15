/*
 * pwix:tabular/src/client/components/edit_btn/edit_btn.js
 *
 * Data context is provided at instanciation time:
 * - item: the row data
 * - table: the Tabular.Table instance
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './edit_btn.html';

Template.edit_btn.onCreated( function(){
    const self = this;

    self.PCK = {
        // have a deep copy of provided data context
        dataContext: new ReactiveVar( null ),
        // manage the UI
        enabled: new ReactiveVar( true ),
        title: new ReactiveVar( '' )
    };

    // keep a copy of the initial data context
    self.autorun(( comp ) => {
        const dataContext = Template.currentData();
        if( dataContext.item && dataContext.table ){
            self.PCK.dataContext.set( _.cloneDeep( dataContext ));
            // table.opt() prototype is ( name, default, row_value )
            dataContext.table.opt( 'editItem', dataContext.item, dataContext.item );
            dataContext.table.opt( 'editButtonEnabled', true, dataContext.item )
                .then(( res ) => { self.PCK.enabled.set( res ); })
            dataContext.table.opt( 'editButtonTitle', pwixI18n.label( I18N, 'edit.btn_title', dataContext.item._id ), dataContext.item )
                .then(( res ) => { self.PCK.title.set( res ); });
            // run only once
            comp.stop();
        }
    });
});

Template.edit_btn.helpers({
    // whether to show the disabled button ?
    enabledClass(){
        return Template.instance().PCK.enabled.get() || !Tabular.configure().hideDisabled ? '' : 'ui-transparent';
    },

    // whether the displayed row is editable ? defaulting to true
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
        instance.$( event.currentTarget ).trigger( 'tabular-edit-event', instance.PCK.dataContext.get());
    }
});
