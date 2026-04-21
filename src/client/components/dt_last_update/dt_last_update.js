/*
 * pwix:tabular:src/client/components/dt_last_update/dt_last_update.js
 *
 * Render the last update at/by of an object.
 *
 * Parms:
 * - item: a timestampable object
 */

import _ from 'lodash';
import strftime from 'strftime';

import { Logger } from 'meteor/pwix:logger';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './dt_last_update.html';

const logger = Logger.get();

Template.dt_last_update.onCreated( function(){
    const self = this;

    self.PCK = {
        author: new ReactiveVar( '' ),
        // created_at / updated_at
        stamp_at: new ReactiveVar( null ),
        // created_by / updated_by
        stamp_by: new ReactiveVar( null )
    };

    // get either the created at/by or the update at/by
    self.autorun(() => {
        const item = Template.currentData().item;
        if( item.updated_at && item.updated_by ){
            self.PCK.stamp_at.set( item.updatedAt );
            self.PCK.stamp_by.set( item.updatedBy );
        } else if( item.createdAt ){
            self.PCK.stamp_at.set( item.createdAt );
            self.PCK.stamp_by.set( item.createdBy );
        }
    });

    // when we have a stamp_by, get the label (if possible)
    self.autorun(() => {
        const id = self.PCK.stamp_by.get();
        if( id ){
            if( Package['pwix:accounts-core'] && Package['pwix:accounts-core'].AccountsCore ){
                const AccountsCore = Package['pwix:accounts-core'].AccountsCore;
                AccountsCore.preferredLabel( 'users', id ).then(( res ) => {
                    self.PCK.author.set( res.label );
                });
            } else {
                self.PCK.author.set( id );
            }
        }
    });

    // track the RVs
    self.autorun(() => {
        //logger.debug( 'stamp_at', self.PCK.stamp_at.get());
    });
    self.autorun(() => {
        //logger.debug( 'stamp_by', self.PCK.stamp_by.get());
    });
    self.autorun(() => {
        //logger.debug( 'author', self.PCK.author.get());
    });
});

Template.dt_last_update.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // render the last update
    last_update(){
        const stamp = strftime( '%Y-%m-%d %H:%M:%S', Template.instance().PCK.stamp_at.get());
        const author = Template.instance().PCK.author.get();
        return pwixI18n.label( I18N, 'last_update.format', stamp, author );
    }
});
