/*
 * pwix:tabular/src/client/components/info_btn/info_btn.js
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - table: the Tabular.Table instance
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import './info_btn.html';

Template.info_btn.helpers({

    // miButton parameters
    //  keep 'enabled' as a function to be dynamically callable by ModalInfo
    parmsModalInfo(){
        return {
            titleButton: this.table.opt( 'infoButtonTitle', pwixI18n.label( I18N, 'info.btn_title', this.item._id ), this.item ),
            titleDialog: pwixI18n.label( I18N, 'modalinfo.dialog_title' ),
            mdClassesContent: this.table.opt( 'dialogClasses', '', this.item ),
            object: this.item,
            classButton: 'btn-sm btn-outline-primary',
            stampFormat: '%Y-%m-%d %H:%M:%S',
            enabled: this.table.arg( 'infoButtonEnabled' ) || true
        }
    },

    // whether to show the disabled button ?
    show(){
        return this.table.opt( 'infoButtonEnabled', true, this.item ) || !Tabular.configure().hideDisabled;
    }
});

Template.info_btn.events({
    'click .tabular-info-btn button'( event, instance ){
        instance.$( event.currentTarget ).trigger( 'tabular-info-event', this.item );
    }
});
