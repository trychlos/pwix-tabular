/*
 * pwix:tabular/src/common/classes/table.js
 */

import _ from 'lodash';

import { check, Match } from 'meteor/check';
import { Field } from 'meteor/pwix:field';
import { Logger } from 'meteor/pwix:logger';
import { Modal } from 'meteor/pwix:modal';
import { Mongo } from 'meteor/mongo';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { default as alTabular } from 'meteor/aldeed:tabular';
import { Tracker } from 'meteor/tracker';

const logger = Logger.get();

export class Table extends alTabular.Table {

    // static data

    // private data

    // instanciation args
    #args = null;

    // whether the 'tabular_ext' template has been rendered
    #rendered = new ReactiveVar( false );

    // additional buttons
    #after = new ReactiveVar( [] );
    #before = new ReactiveVar( [] );

    // whether we have an additional buttons column
    #haveButtonsColumn = new ReactiveVar( false );

    // whether the 'tabular' deprecation has already been warned
    #tabularWarned = false;

    // static methods

    // private methods

    // add a column to the table definition if we have have additional buttons
    // tmpContext is evaluated at button instanciation
    _addButtonsColumn( o ){
        const self = this;
        Tracker.autorun( async () => {
            const haveAnyButton = await self.opt( 'withDeleteButton', true ) || await self.opt( 'withEditButton', true ) || await self.opt( 'withInfoButton', true ) || this.#after.get().length || this.#before.get().length;
            if( haveAnyButton ){
                o.columns.push({
                    orderable: false,
                    tmpl: Meteor.isClient && Template.dt_buttons,
                    tmplContext( rowData ){
                        return {
                            item: rowData,
                            table: self
                        };
                    }
                });
                //logger.debug( 'addButtonsColumn()', this.name, o.columns );
            }
            self.#haveButtonsColumn.set( haveAnyButton );
        });
    }

    // add a button as the header of the extra buttons column to edit the table settings
    // this require a) to have an extra buttons column and b) to have at least one required item to be displayed in this settings dropdown menu
    _addSettingsButton( o ){
        const self = this;
        Tracker.autorun( async () => {
            //logger.debug( 'pwix:tabular', self.name, o, o.headerCallback );
            const items = await self.opt( 'withSettingsItems', [] );
            const haveAnyButton = self.#haveButtonsColumn.get();
            if( items.length && haveAnyButton ){
                o.headerCallback = function( thead ){
                    const $th = $( thead ).find( 'th' );
                    if( $th.length ){
                        const $settingsTh = $th.eq( $th.length-1 );
                        if( $settingsTh.data( 'dtSettingsView' )) return;
                        $settingsTh.empty();
                        const view = Blaze.renderWithData( Template.dt_settings, { table: self }, $settingsTh[0] );
                        // Store the view so we can destroy it later if needed
                        $settingsTh.data( 'dtSettingsView', view );
                    }
                };
                // take care of informing the underlying aldeed:tabular.Table options of this update
                // rationale: aldeed:tabular.Table keeps both some individual items of the options because it uses them to handle the pagination
                // and an 'omitted' copy of the provided options. At this moment of the instanciation, the below line is the only way to
                // make the underlying package know that we need to insert into the DT callbacks
                self.options.headerCallback = o.headerCallback;
            }
        });
    }

    /*
     * @param {String} name
     * @returns the content of the instanciation argument, which may be null
     */
    _arg( name ){
        let res = null;
        if( this.#args ){
            if( this.#args.pwix ){
                if( Object.keys( this.#args.pwix).includes( name )){
                    res = this.#args.pwix[name];
                }
            }
            if( this.#args.tabular ){
                if( !this.#tabularWarned ){
                    logger.warn( 'Table._arg() the \'tabular\' sub-object has been deprecated since v1.7. You should update your code and/or your configurations to use \'pwix\' instead' );
                    this.#tabularWarned = true;
                }
                if( !res && Object.keys( this.#args.tabular).includes( name )){
                    res = this.#args.tabular[name];
                }
            }
        }
        return res;
    }

    // compute additional buttons to be added to standard info/edit/delete buttons
    //  from the instanciation args, create an insert before and an append after lists, maybe both or one or none empty
    async _computeAdditionalButtons(){
        let parms = this.#args && this.#args.pwix && this.#args.pwix.buttons ? this.#args.pwix.buttons : [];
        parms = ( typeof parms === 'function' ) ? await parms() : parms;
        if( !parms || !_.isArray( parms )){
            logger.error( '_computeAdditionalButtons() expects an array, got', parms, 'throwing...' );
            throw new Error( 'Bad argument: parms' );
        }
        let after = [];
        let before = [];
        parms.forEach(( it ) => {
            if( !it || !_.isObject( it )){
                logger.error( '_computeAdditionalButtons() expects an object, got', it, 'throwing...' );
                throw new Error( 'Bad argument: it' );
            }
            if( it.where !== Tabular.C.Where.AFTER && it.where !== Tabular.C.Where.BEFORE ){
                logger.error( '_computeAdditionalButtons() expects\'where\' be Tabular.C.Where.AFTER or Tabular.C.Where.BEFORE, got', it.where, 'throwing...' );
                throw new Error( 'Bad argument: where' );
            }
            if( it.buttons && !_.isArray( it.buttons )){
                logger.error( '_computeAdditionalButtons() expects an array of button definitions, got', it.buttons, 'throwing...' );
                throw new Error( 'Bad argument: buttons' );
            }
            if( it.buttons ){
                it.buttons.forEach(( btn ) => {
                    if( it.where === Tabular.C.Where.AFTER ){
                        after.push( btn );
                    } else {
                        before.push( btn );
                    }
                });
            }
        });
        this.#after.set( after );
        this.#before.set( before );
        //logger.debug( '_computeAdditionalButtons', 'after', after, 'before', before );
    }

    // if a template is named, make sure we install the corresponding instance (which must exist)
    // @locus: client only
    _setTemplatesFromStrings( o ){
        if( Meteor.isClient ){
            o.columns.forEach(( it ) => {
                if( _.isString( it.tmpl )){
                    if( Template[it.tmpl] ){
                        it.tmpl = Template[it.tmpl];    
                    } else {
                        logger.warning( '_setTemplatesFromStrings() \''+it.tmmpl+'\' template not instanciated. You should instanciate it in your client code before running common initialization code.' );
                    }
                }
            });
        }
    }

    /**
     * @param {Object} options the TabularExt definition
     * @returns {TabularExt} this instance
     */
    constructor( options ){
        options = options || {};
        if( !options.collection ){
            options.collection = new Mongo.Collection( null );
        }
        super( options );

        // keep the instanciation arguments
        this.#args = options;

        // add editional buttons
        // info/edit/delete buttons are rather opt-out (default to true)
        // before and after additional buttons are opt-in (must be explicitely defined)
        this._computeAdditionalButtons().then(() => {
            this._addButtonsColumn( options );
            this._addSettingsButton( options );
            this._setTemplatesFromStrings( options );
        });

        //logger.debug( 'instanciating', this.name, options );
        return this;
    }

    /**
     * @param {String} where whether we want Tabular.C.Where.AFTER or Tabular.C.Where.BEFORE buttons 
     * @returns the array of additional buttons, may be empty
     */
    additionalButtons( where ){
        if( where === Tabular.C.Where.AFTER ){
            return this.#after.get();
        } else if( where === Tabular.C.Where.BEFORE ){
            return this.#before.get();
        } else {
            logger.error( 'additionalButtons() expects \'where\' be Tabular.C.Where.AFTER or Tabular.C.Where.BEFORE, got', where, 'throwing...' );
            throw new Error( 'Bad argument: where' );
        }
    }

    /**
     * @locus Client
     * @summary Edit the tabular settings
     *  The table must be named.
     * @param {Object} opts optional options object with following keys:
     *  - fieldset: the Field.Set to be used as a reference when editing columns (visibility and ordering)
     *  - $target: the jQuery element which will be the target of the terminating event
     */
    editTabularSettings( opts={} ){
        if( Meteor.isClient ){
            if( this.name ){
                Modal.run({
                    table: this,
                    fieldset: opts.fieldset,    // can be undefined
                    $target: opts.$target,      // can be undefined
                    mdBody: 'settings_dialog',
                    mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
                    mdClasses: 'modal-md',
                    mdTitle: pwixI18n.label( I18N, 'settings.dialog_title' )
                });
            } else {
                logger.warning( 'cowardly refuse to edit the settings of an unnamed tabular' );
            }
        }
    }

    /**
     * @param {String} name
     * @param {Any} def
     * @param {Object} rowData
     * @returns the value, or the value returned by the function, or the default value
     */
    async opt( name, def, rowData ){
        let res = this._arg( name );
        res = ( res == null ) ? def : (( typeof res === 'function' ) ? await res( rowData ) : res );
        return res;
    }
};
