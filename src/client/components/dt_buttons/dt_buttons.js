/*
 * pwix:tabular/src/client/components/dt_buttons/dt_buttons.js
 *
 * Display the standard 'info', 'edit' and 'delete' buttons
 * Maybe preceded by 'before' buttons
 * Maybe followed by 'after' buttons
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - table: the Tabular.Table instance
 */

import { check, Match } from 'meteor/check';
import { Logger } from 'meteor/pwix:logger';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import '../delete_btn/delete_btn.js';
import '../edit_btn/edit_btn.js';
import '../info_btn/info_btn.js';

import './dt_buttons.html';

const logger = Logger.get();

Template.dt_buttons.onCreated( function(){
    const self = this;

    self.PCK = {
        buttons: new ReactiveVar( [] )
    };

    self.autorun( async () => {
        const dc = Template.currentData();
        if( dc.table ){
            check( dc.table, Tabular.Table );
            let buttons = [];
            const haveInfo = await dc.table.opt( 'withInfoButton', true );
            if( haveInfo ){
                buttons.push( 'info_btn' );
                //self.PCK.haveInfoButton.set( haveInfo );
            }
            const haveEdit = await dc.table.opt( 'withEditButton', true );
            if( haveEdit ){
                buttons.push( 'edit_btn' );
                //self.PCK.haveEditButton.set( haveEdit );
            }
            const haveDelete = await dc.table.opt( 'withDeleteButton', true );
            if( haveDelete ){
                buttons.push( 'delete_btn' );
                //self.PCK.haveDeleteButton.set( haveDelete );
            }
            const array = dc.table.buttonsHooks();
            for( const fn of array ){
                buttons = await fn( dc.table, buttons );
            }
            self.PCK.buttons.set( buttons );
        }
    });
});

Template.dt_buttons.helpers({
    // the list of buttons
    buttons(){
        return Template.instance().PCK.buttons.get();
    }
});
