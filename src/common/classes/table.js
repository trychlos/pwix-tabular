/*
 * pwix:tabular/src/common/classes/table.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { ReactiveVar } from 'meteor/reactive-var';
import { default as alTabular } from 'meteor/aldeed:tabular';
import { Tracker } from 'meteor/tracker';

export class Table extends alTabular.Table {

    // private data

    // instanciation args
    #args = null;

    // whether the 'tabular_ext' template has been rendered
    #rendered = new ReactiveVar( false );

    // additional buttons
    #after = new ReactiveVar( [] );
    #before = new ReactiveVar( [] );

    // private methods

    // compute additional buttons
    //  from the instanciation args, create an insert before and an append after lists, maybe both or one or none empty
    async _computeAdditionalButtons(){
        let parms = this.#args && this.#args.tabular && this.#args.tabular.buttons ? this.#args.tabular.buttons : [];
        parms = ( typeof parms === 'function' ) ? await parms() : parms;
        assert( parms && _.isArray( parms ), 'expect an array, found '+parms );
        let after = [];
        let before = [];
        parms.forEach(( it ) => {
            assert( it && _.isObject( it ), 'expect an object, found '+it );
            assert( it.where === Tabular.C.Where.AFTER || it.where === Tabular.C.Where.BEFORE, 'expect where is Tabular.C.Where.AFTER or Tabular.C.Where.BEFORE, found '+it.where );
            assert( !it.buttons || _.isArray( it.buttons ), 'expect where an array of buttons definitions, found '+it.buttons );
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
    }

    // add the info/edit/delete buttons at the end of each row
    _addButtonsColumn( o ){
        const self = this;
        Tracker.autorun(() => {
            const haveAnyButton = self.opt( 'withDeleteButton', true ) || self.opt( 'withEditButton', true ) || self.opt( 'withInfoButton', true ) || this.#after.get().length || this.#before.get().length;
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
            }
        });
    }

    // install a checbox to display Boolean values unless a template be already provided
    _setCheckboxes( o ){
        const self = this;
        o.columns.forEach(( it ) => {
            if( it.tmpl === 'dt_checkbox' ){
                it.tmpl = Meteor.isClient && Template.dt_checkbox;
            }
        });
    }

    constructor( o ){
        super( ...arguments );

        // keep the instanciation arguments
        this.#args = o;

        // add edition buttons unless otherwise requested
        this._computeAdditionalButtons().then(() => {
            this._addButtonsColumn( o );
            this._setCheckboxes( o );
        });

        // track the 'rendered' state
        Tracker.autorun(() => {
            //console.debug( 'pwix:tabular rendered', this.name, this.rendered());
        });

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
            assert( false, 'expect where be Tabular.C.Where.AFTER or Tabular.C.Where.BEFORE, found '+where );
        }
    }

    /**
     * @param {String} name
     * @returns the content of the instanciation argument, which may be null
     */
    arg( name ){
        let res = null;
        if( this.#args && this.#args.tabular && Object.keys( this.#args.tabular).includes( name )){
            res = this.#args.tabular[name];
        }
        return res;
    }

    /**
     * @param {String} name
     * @param {Any} def
     * @param {Object} rowData
     * @returns the value, or the value returned by the function, or the default value
     */
    async opt( name, def, rowData ){
        let res = this.arg( name );
        res = res ? (( typeof res === 'function' ) ? await res( rowData ) : res ) : def;
        return res;
    }

    /**
     * Getter/Setter
     * @param {Boolean} rendered
     * @returns {Boolean} whether the associated template_ext component has been rendered
     */
    rendered( rendered ){
        if( rendered !== undefined ){
            if( rendered === true || rendered === false ){
                this.#rendered.set( rendered );
            } else {
                console.error( 'expected a Boolean value, found', rendered );
            }
        }
        return this.#rendered.get();
    }
};
