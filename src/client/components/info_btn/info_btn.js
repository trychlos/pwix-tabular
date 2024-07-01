/*
 * pwix:tabular/src/client/components/info_btn/info_btn.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './info_btn.html';

Template.info_btn.onCreated( function(){
    const self = this;

    self.PCK = {
        object: new ReactiveVar( null ),
        enabled: new ReactiveVar( true ),
        title: new ReactiveVar( '' )
    };

    // track the target object which may come from an async function
    self.autorun(() => {
        const dataContext = Template.currentData();
        let object = dataContext.item;
        let promises = [];
        const p = dataContext.table.opt( 'infoItem', dataContext.item, dataContext.item );
        if( p instanceof Promise ){
            promises.push( p.then(( res ) => {
                object = res;
                return res;
            }));
        }
        Promise.allSettled( promises ).then(() => {
            self.PCK.object.set( object );
        });
    });
});

Template.info_btn.onRendered( function(){
    const self = this;

    // get asynchronously the enabled state
    self.autorun(() => {
        const dc = Template.currentData();
        if( dc.item && dc.table ){
            dc.table.opt( 'infoButtonEnabled', true, dc.item ).then(( res ) => { self.PCK.enabled.set( res ); });
        }
    });

    // get asynchronously the button title
    self.autorun(() => {
        const dc = Template.currentData();
        if( dc.item && dc.table ){
            dc.table.opt( 'infoButtonTitle', pwixI18n.label( I18N, 'info.btn_title', dc.item._id ), dc.item ).then(( res ) => { self.PCK.title.set( res ); });
        }
    });
});

Template.info_btn.helpers({

    // miButton parameters
    parmsModalInfo(){
        return {
            titleButton: Template.instance().PCK.title.get(),
            titleDialog: this.table.opt( 'infoModalTitle', pwixI18n.label( I18N, 'modalinfo.dialog_title', this.item._id ), this.item ),
            mdClassesContent: this.table.opt( 'dialogClasses', '', this.item ),
            object: Template.instance().PCK.object.get(),
            classButton: 'btn-sm btn-outline-primary',
            stampFormat: '%Y-%m-%d %H:%M:%S',
            enabled: Template.instance().PCK.enabled.get()
        };
    },

    // whether to show the disabled button ?
    show(){
        return Template.instance().PCK.enabled.get() || !Tabular.configure().hideDisabled;
    }
});

Template.info_btn.events({
    'click .tabular-info-btn button'( event, instance ){
        instance.$( event.currentTarget ).trigger( 'tabular-info-event', this );
    }
});
