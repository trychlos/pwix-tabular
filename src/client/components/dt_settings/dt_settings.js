/*
 * pwix:tabular/src/client/components/dt_settings/dt_settings.js
 *
 * Data context is provided at instanciation time:
 * - table: the Tabular.Table instance
 * 
 * Starting with v1.8, 'withSettingsItems' option has been deprecated in favor of 'withSettingsButton'.
 * Most of this code becomes just unused. Is nonetheless kept if the dropdown menu comes back someday.
 */

import _ from 'lodash';

import { Logger } from 'meteor/pwix:logger';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './dt_settings.html';

const logger = Logger.get();

Template.dt_settings.onCreated( function(){
    const self = this;

    self.PCK = {
        // have a deep copy of provided data context
        dataContext: new ReactiveVar( null ),
        // the items list
        list: new ReactiveVar( [] ),
        constants: {
            COLUMN_SELECTION: {
                icon: '<span class="fa-solid fa-fw fa-chevron-right ui-mr05"></span>',
                css: 'dropdown-item d-flex align-items-center justify-content-start',
                label(){ return pwixI18n.label( I18N, 'settings.columns_selection' ); },
                event: Tabular.C.Items.COLUMN_SELECTION
            },
            DIVIDER: {
                css: 'dropdown-divider'
            },
            TABULAR_SETTINGS: {}
        }
    };

    // keep a copy of the initial data context
    self.autorun(( comp ) => {
        const dataContext = Template.currentData();
        if( dataContext.table ){
            self.PCK.dataContext.set( dataContext );
            // run only once
            comp.stop();
        }
    });

    // build the items list
    self.autorun(() => {
        const dataContext = self.PCK.dataContext.get();
        if( dataContext ){
            const table = dataContext.table;
            table.opt( 'withSettingsItems' ).then(( items ) => {
                if( items ){
                    let list = [];
                    items.every(( it ) => {
                        if( it instanceof String || typeof( it ) === 'string' ){
                            if( Object.keys( self.PCK.constants ).includes( it )){
                                list.push( self.PCK.constants[it] );
                            } else {
                                logger.warn( 'pwix:tabular \''+it+'\' identifier is not known' );
                            }
                        } else if( it.css || it.event || it.icon || it.label ){
                            list.push( it );
                        } else {
                            logger.warn( 'pwix:tabular provided item doesn\'t seem to have any necessary informations (see AppPages::MenuItem class), got', it );
                        }
                        return true;
                    });
                    self.PCK.list.set( list );
                }
            });
        }
    });
});

Template.dt_settings.helpers({
    // class
    css( it ){
        return it.css ? ( typeof( it.css ) === 'function' ? it.css() : it.css ) : '';
    },

    // event
    event( it ){
        return it.event ? ( typeof( it.event ) === 'function' ? it.event() : it.event ) : '';
    },

    // we only have a dropdown menu if more than a single option
    haveDropdown( arg ){
        return Template.instance().PCK.list.get().length > 1;
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // icon
    icon( it ){
        return it.icon ? ( typeof( it.icon ) === 'function' ? it.icon() : it.icon ) : '';
    },

    // label
    label( it ){
        return it.label ? ( typeof( it.label ) === 'function' ? it.label() : it.label ) : '';
    },

    // list of requested items
    optionsList(){
        return Template.instance().PCK.list.get();
    }
});

Template.dt_settings.events({
    'click .dropdown-item'( event, instance ){
        const $currentTarget = instance.$( event.currentTarget );
        const data = $currentTarget.data( 'event' );
        const dataContext = instance.PCK.dataContext.get();
        if( data && dataContext ){
            dataContext.item = data
            $currentTarget.trigger( 'tabular-settings-event', dataContext );
        }
    },

    // if we have only one option, then no dropdown and just the button itself
    'click .no-dropdown'( event, instance ){
       instance.$( event.currentTarget ).trigger( 'tabular-settings-event', this );
    }
});
