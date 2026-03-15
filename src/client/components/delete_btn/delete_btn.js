/*
 * pwix:tabular/src/client/components/delete_btn/delete_btn.js
 *
 * Data context is provided at instanciation time:
 * - item: the row data
 * - table: the Tabular.Table instance
 */

import _ from 'lodash';

import { Bootbox } from 'meteor/pwix:bootbox';
import { Logger } from 'meteor/pwix:logger';
import { ReactiveVar } from 'meteor/reactive-var';

import './delete_btn.html';

const logger = Logger.get();

Template.delete_btn.onCreated( function(){
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
            dataContext.table.opt( 'deleteItem', dataContext.item, dataContext.item );
            dataContext.table.opt( 'deleteButtonEnabled', true, dataContext.item )
                .then(( res ) => { self.PCK.enabled.set( res ); })
            dataContext.table.opt( 'deleteButtonTitle', pwixI18n.label( I18N, 'delete.btn_title', dataContext.item._id ), dataContext.item )
                .then(( res ) => { self.PCK.title.set( res ); });
            // run only once
            comp.stop();
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
        return Template.instance().PCK.title.get();
    }
});

Template.delete_btn.events({
    async 'click .tabular-delete-btn button'( event, instance ){
        const dataContext = instance.PCK.dataContext.get();
        const wantConfirmation = this.table.opt( 'wantDeleteConfirmation', true, dataContext.item );
        if( wantConfirmation ){
            Bootbox.confirm({
                title: await this.table.opt( 'deleteConfirmationTitle', pwixI18n.label( I18N, 'delete.confirm_title', dataContext.item._id ), dataContext.item ),
                message: await this.table.opt( 'deleteConfirmationText', pwixI18n.label( I18N, 'delete.confirm_content', dataContext.item._id ), dataContext.item ),
                mdClassesContent: await this.table.opt( 'dialogClasses', '', dataContext.item )
            }, function( ret ){
                    if( ret ){
                        instance.$( event.currentTarget ).trigger( 'tabular-delete-event', dataContext );
                    } else {
                        logger.notice( 'user didn\'t confirm the deletion' );
                    }
                }
            );
        } else {
            instance.$( event.currentTarget ).trigger( 'tabular-delete-event', dataContext );
        }
    }
});
