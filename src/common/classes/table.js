/*
 * pwix:tabular/src/common/classes/table.js
 */

import _ from 'lodash';

import { check, Match } from 'meteor/check';
import { Logger } from 'meteor/pwix:logger';
import { Modal } from 'meteor/pwix:modal';
import { Mongo } from 'meteor/mongo';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { default as alTabular } from 'meteor/aldeed:tabular';
import { Tracker } from 'meteor/tracker';

const logger = Logger.get();

const debugTableName = '';

export class Table extends alTabular.Table {

    // static data

    // private data

    // instanciation args
    #args = null;

    // whether the 'tabular_ext' template has been rendered
    #rendered = new ReactiveVar( false );

    // additional buttons
    #buttonsHooks = new ReactiveVar( [] );

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
            const haveAnyButton = await self.opt( 'withDeleteButton', true ) || await self.opt( 'withEditButton', true ) || await self.opt( 'withInfoButton', true ) || self.#buttonsHooks.get().length;
            if( haveAnyButton ){
                o.columns.push({
                    name: 'dt_buttons',
                    orderable: false,
                    tmpl: Meteor.isClient && Template.dt_buttons,
                    tmplContext( rowData ){
                        return {
                            item: rowData,
                            table: self
                        };
                    }
                });
            }
            self.#haveButtonsColumn.set( haveAnyButton );
        });
    }

    // add a button as the header of the extra buttons column to edit the table settings
    // this require a) to have an extra buttons column and b) to have the 'withSettingsButton' true
    // we wait for the init be completed before installing our settings button in the header
    _addSettingsButton( o ){
        const self = this;
        Tracker.autorun( async () => {
            // check for option deprecation
            const items = await self.opt( 'withSettingsItems', null );
            if( items ){
                logger.warning( 'the \'withSettingsItem\' option has been deprecated in v1.8 in favor of \'withSettingsButton\'. You should update your code' );
            }
            // check for settings button
            const haveSettingsButton = await self.opt( 'withSettingsButton', true );
            const haveAnyButton = self.#haveButtonsColumn.get();
            if( haveSettingsButton && haveAnyButton ){
                o.headerCallback = function( thead, data, start, end, display ){
                    // 'this' is the jQuery object with holds the table.dataTable element
                    if( this.data( 'initCompleted' )){
                        if( debugTableName && self.name === debugTableName ) logger.debug( 'addSettingsButtons() headerCallback', this, thead, data, start, end, display );
                        const $th = $( thead ).find( 'th' );
                        if( $th.length ){
                            const result = self._getOrder( 'dt_buttons' );
                            if( debugTableName && self.name === debugTableName ) logger.debug( 'dt_buttons', result, $th.length );
                            // if the order is not recorded in settings, then consider we address the last column
                            if( !result.haveSettings ){
                                result.index = $th.length - 1;
                            }
                            if( result.index >= 0 && result.index < $th.length ){
                                const $settingsTh = $th.eq( result.index );
                                if( $settingsTh.data( 'dtSettingsView' )) return;
                                //if( debugTableName && self.name === debugTableName ) logger.debug( 'installing settings button', idx, $th.length );
                                $settingsTh.empty();
                                const view = Blaze.renderWithData( Template.dt_settings, { table: self }, $settingsTh[0] );
                                // Store the view so we can destroy it later if needed
                                $settingsTh.data( 'dtSettingsView', view );
                            }
                        }
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
     * @returns {Object} an object with following keys:
     *  - hasSettings: whether we have found a settings string
     *  - index: whether we have found the serached name, or -1
     */
    _getOrder( name ){
        const self = this;
        const settings = Tabular.getSettingsColumns( this.name );
        const haveSettings = Boolean( settings );
        if( debugTableName && self.name === debugTableName ) logger.debug( 'haveSettings', haveSettings, 'settings', settings );
        if( haveSettings ){
            //const order = colReorder.order();
            let index = 0;
            for( const col of settings ){
                if( col === name ){
                    return { haveSettings, index };
                }
                index += 1;
            }
        }
        return { haveSettings, index: -1 };
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
    //  from the instanciation args, create an insert before and an append after lists, maybe both or one or none
    async _computeAdditionalButtons(){
        const parms = await this.opt( 'buttons', null );
        if( parms ){
            logger.warning( '\'pwix.buttons\' is deprecated since v1.9 in favor of \'buttonsHooks()\' method. You should update your code' );
        }
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
                        logger.warning( '_setTemplatesFromStrings() \''+it.tmpl+'\' template not instanciated. You should instanciate it in your client code before running common initialization.' );
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
        // we default with ColReorder if the caller has not opt-out
        if( !Object.keys( options ).includes( 'colReorder' )){
            options.colReorder = true;
        }
        // do not override user initComplete() DT callback
        const _addInitCompleteCallback = ( opts ) => {
            const userInitComplete = opts.initComplete;
            opts.initComplete = function(){
                // 'this' is a jQuery object on the table.dataTable element
                // arguments are datatable internals
                //logger.debug( 'this', this, arguments, opts.name );
                //logger.debug( 'isDatatable', $.fn.dataTable.isDataTable( this[0] ));
                if( $.fn.dataTable.isDataTable( this[0] )){
                    const dtTable = this.DataTable();
                    Tabular.applyState( opts.name, dtTable );
                    this.data( 'initCompleted', true );
                }
                if( userInitComplete ) userInitComplete.apply( this, arguments );
            };
        };
        // must be called before super()
        _addInitCompleteCallback( options );

        // the DataTable itself is instanciated from an aldeed:tabular.template.onRendered() autorun
        super( options );
        const self = this;

        // keep the instanciation arguments
        this.#args = options;

        // this function is to be removed as only used to warn against deprecated pwix.buttons usage (todo #7)
        this._computeAdditionalButtons();

        // add column for additional buttons
        // info/edit/delete buttons are rather opt-out (default to true)
        // other additional buttons are opt-in (must be explicitely defined via buttons hooks functions)
        self._addButtonsColumn( options );
        self._addSettingsButton( options );
        self._setTemplatesFromStrings( options );

        //logger.debug( 'instanciating', this.name, options );
        return this;
    }

    /**
     * Getter/Setter
     * @summary Update the buttons hooks array
     *  NB: note that this should be used immediately after instanciation and before the tabular has a chance to be rendered in order to prevent flickering
     * @param {Array|Function} array_or_function
     * @returns {Array}
     */
    buttonsHooks( array ){
        if( array ){
            check( array, Match.OneOf( [Function], Function ));
            if( _.isFunction( array )){
                array = [ array ];
            }
            this.#buttonsHooks.set( array );
        }
        return this.#buttonsHooks.get();
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
