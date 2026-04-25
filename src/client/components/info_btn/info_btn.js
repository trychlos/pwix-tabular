/*
 * pwix:tabular/src/client/components/info_btn/info_btn.js
 *
 * Data context is provided at instanciation time:
 * - item: the row data
 * - table: the Tabular.Table instance
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './info_btn.html';

Template.info_btn.onCreated( function(){
    const self = this;

    self.PCK = {
        // have a deep copy of provided data context
        dataContext: new ReactiveVar( null ),
        // whether the 'info' button is hidden when disabled
        hideWhenDisabled: new ReactiveVar( Tabular.configure().hideDisabled ),
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
            dataContext.table.opt( 'infoItem', dataContext.item, dataContext.item );
            dataContext.table.opt( 'infoButtonEnabled', true, dataContext.item )
                .then(( res ) => { self.PCK.enabled.set( res ); })
            dataContext.table.opt( 'infoButtonTitle', pwixI18n.label( I18N, 'info.btn_title', dataContext.item._id ), dataContext.item )
                .then(( res ) => { self.PCK.title.set( res ); });
            // hide when disabled ?
            dataContext.table.opt( 'hideDisabled', Tabular.configure().hideDisabled )
                .then(( res ) => { self.PCK.hideWhenDisabled.set( res ); });
            // run only once
            comp.stop();
        }
    });
});

Template.info_btn.helpers({

    // miButton parameters
    parmsModalInfo(){
        const dataContext = Template.instance().PCK.dataContext.get();
        return {
            titleButton: Template.instance().PCK.title.get(),
            titleDialog: this.table.opt( 'infoModalTitle', pwixI18n.label( I18N, 'modalinfo.dialog_title', dataContext.item._id ), dataContext.item ),
            mdClassesContent: this.table.opt( 'dialogClasses', '', dataContext.item ),
            object: dataContext.item,
            classButton: 'btn-sm btn-outline-primary',
            stampFormat: '%Y-%m-%d %H:%M:%S',
            enabled: Template.instance().PCK.enabled.get()
        };
    },

    // whether to show the disabled button ?
    show(){
        return Template.instance().PCK.enabled.get() || !Template.instance().PCK.hideWhenDisabled.get();
    }
});

Template.info_btn.events({
    'click .tabular-info-btn button'( event, instance ){
        instance.$( event.currentTarget ).trigger( 'tabular-info-event', instance.PCK.dataContext.get());
    }
});
