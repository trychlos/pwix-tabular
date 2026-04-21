/*
 * /imports/client/components/settings_dialog/settings_dialog.js
 *
 * A modal dialog to select the displayed columns.
 * 
 * Parms:
 * - table: the Table instance
 * - fieldset: (opt) the whole known fieldset to select the columns among
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Field } from 'meteor/pwix:field';
import { Forms } from 'meteor/pwix:forms';
import { Logger } from 'meteor/pwix:logger';
import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tabbed } from 'meteor/pwix:tabbed';
import { Tolert } from 'meteor/pwix:tolert';

import '../settings_columns_tab/settings_columns_tab.js';

import './settings_dialog.html';

const logger = Logger.get();

Template.settings_dialog.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.PCK = {
        // the Form.Checker instance for this dialog
        checker: new ReactiveVar( null ),
        // the global Message zone for this modal
        messager: new Forms.Messager(),
        // whether we are running inside of a Modal
        isModal: new ReactiveVar( false ),
        // the Tabbed instance
        tabbed: new Tabbed.Instance( self, { name: 'settings_dialog' }),
        // selected columns
        // will be set as a ReactiveVar only if a fieldset is provided in the data context
        columns: null
    };

    // when the data context is ready
    self.autorun(() => {
        const dc = Template.currentData();
        if( dc.table ){
            Tracker.nonreactive(() => {
                const fieldset = dc.fieldset;
                const tabs = [];
                if( fieldset ){
                    check( fieldset, Field.Set );
                    self.PCK.columns = new ReactiveVar( [] );
                    // get the visible columns
                    let names = Tabular.getSettingsColumns( dc.table.name );
                    if( !names ){
                        names = [];
                        for( const it of dc.table.options.columns ){
                            if( it.name && it.visible !== false ){
                                names.push( it.name );
                            }
                        }
                    }
                    self.PCK.columns.set( names );
                    // have a ta&b for the columns selection if a fieldset is provided
                    tabs.push({
                        name: 'settings_columns_tab',
                        navLabel: pwixI18n.label( I18N, 'settings.columns_selection' ),
                        paneTemplate: 'settings_columns_tab'
                    });
                }
                // initialize the named Tabbed
                self.PCK.tabbed.setTabbedParms({ 
                    dataContext: {
                        table: dc.table,
                        fieldset: dc.fieldset,
                        checker: self.PCK.checker,
                        columnsRv: self.PCK.columns
                    },
                    tabs
                });
            });
        }
    });
});

Template.settings_dialog.onRendered( function(){
    const self = this;
    //console.debug( self );

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.PCK.isModal.set( self.$( '.tabular-settings-dialog' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal target
    self.autorun(() => {
        if( self.PCK.isModal.get()){
            Modal.topmost().set({
                target: self.$( '.tabular-settings-dialog' )
            });
        }
    });

    // initialize the Checker for this panel as soon as possible
    // no need for an autorun when we do not wait for a parent checker
    const checker = new Forms.Checker( self );
    checker.init({
        messager: self.PCK.messager,
        onValidityChangeRegisterFn: ( valid ) => {
            if( self.PCK.isModal.get()){
                Modal.topmost().set({ buttons: { id: Modal.C.Button.OK, enabled: valid }});
            }
        }
    }).then(() => {
        self.PCK.checker.set( checker );
    });
});

Template.settings_dialog.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether we run inside of a modal ?
    isModal(){
        return Template.instance().PCK.isModal.get();
    },

    // parms for the Forms.Messager
    parmsMessager(){
        return {
            messager: Template.instance().PCK.messager
        };
    }
});

Template.settings_dialog.events({
    // submit
    //  event triggered in case of a modal
    'md-click .tabular-settings-dialog'( event, instance, data ){
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    //  store as a cookie (if accepted by the user) and update the tabular accordingly
    'iz-submit .tabular-settings-dialog'( event, instance ){
        if( this.fieldset ){
            const names = instance.PCK.columns.get();
            const res = Tabular._store.set( COOKIE_COLUMNS, this.table.name, names.join( ',' ));
            if( res ){
                Tolert.success( pwixI18n.label( I18N, 'settings.recording_success' ));
            } else {
                Tolert.error( pwixI18n.label( I18N, 'settings.recording_error' ));
            }
            // close the modal
            if( instance.PCK.isModal.get()){
                Modal.topmost().close();
            }
        }
        // rebuild the tabular
        //  only changinf the visibility status of the columns could be dealt with directly into Datatables
        //  but changing their order implies a re-init and so a full rebuild from the caller
        if( this.$target ){
            this.$target.trigger( 'tabular-settings-changed' );
        }
    }
});
