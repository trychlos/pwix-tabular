/*
 * pwix:tabular-ext/src/client/components/info_btn/info_btn.js
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - parms: the TabularExt constructor arguments
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import './info_btn.html';

Template.info_btn.onRendered( function(){
});

Template.info_btn.helpers({

    // miButton parameters
    parmsModalInfo(){
        const self = this;
        const enabled = ( Object.keys( self.parms.tabular_ext ) || [] ).includes( 'infoButtonEnabled' ) ? self.parms.tabular_ext.infoButtonEnabled : true;
        let title = ( Object.keys( self.parms.tabular_ext ) || [] ).includes( 'infoButtonTitle' ) ? self.parms.tabular_ext.infoButtonTitle : pwixI18n.label( I18N, 'info.btn_title', self.item._id );
        title = ( typeof title === 'function' ) ? title( self.item ) : title;
        return {
            titleButton: title,
            titleDialog: pwixI18n.label( I18N, 'modalinfo.dialog_title' ),
            //mdClassesContent: Meteor.APP.Pages.current.page().get( 'theme' ),
            name: self.item.emails.length ? self.item.emails[0].address : null,
            object: self.item,
            classButton: 'btn-sm btn-outline-primary',
            stampFormat: '%Y-%m-%d %H:%M:%S',
            enabled: enabled
        }
    },
});
