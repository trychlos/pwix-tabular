/*
 * pwix:tabular-ext/src/client/components/info_btn/info_btn.js
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - parms: the TabularExt constructor arguments
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import './info_btn.html';

Template.info_btn.helpers({

    // miButton parameters
    //  keep 'enabled' as a function to be dynamically callable by ModalInfo
    parmsModalInfo(){
        return {
            titleButton: TabularExt.opt( 'infoButtonTitle', pwixI18n.label( I18N, 'info.btn_title', this.item._id ), this.item ),
            titleDialog: pwixI18n.label( I18N, 'modalinfo.dialog_title' ),
            mdClassesContent: TabularExt.opt( 'dialogClasses', '', this.item ),
            object: this.item,
            classButton: 'btn-sm btn-outline-primary',
            stampFormat: '%Y-%m-%d %H:%M:%S',
            enabled: ( Object.keys( this.parms.tabular_ext ) || [] ).includes( 'infoButtonEnabled' ) ? this.parms.tabular_ext.infoButtonEnabled : true
        }
    },
});

Template.info_btn.events({
    'click .ext-info-btn button'( event, instance ){
        instance.$( event.currentTarget ).trigger( 'tabular-ext-info-event', this.item );
    }
});
