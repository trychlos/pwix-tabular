/*
 * pwix:tabular/src/common/classes/table.js
 */

import { ReactiveVar } from 'meteor/reactive-var';
import Tabular from 'meteor/aldeed:tabular';
import { Tracker } from 'meteor/tracker';

export class Table extends Tabular.Table {

    // private data

    // instanciation args
    #args = null;

    // whether the 'tabular_ext' template has been rendered
    #rendered = new ReactiveVar( false );

    // private methods

    _addDeleteButton( o ){
        const self = this;
        const haveButton = this.opt( 'withDeleteButton', true );
        //console.debug( 'deleteButton', this.name, haveButton );
        if( haveButton ){
            o.columns.push({
                orderable: false,
                tmpl: Meteor.isClient && Template.delete_btn,
                tmplContext( rowData ){
                    return {
                        item: rowData,
                        table: self
                    };
                }
            });
        }
    }

    _addEditButton( o ){
        const self = this;
        const haveButton = this.opt( 'withEditButton', true );
        //console.debug( 'editButton', this.name, haveButton );
        if( haveButton ){
            o.columns.push({
                orderable: false,
                tmpl: Meteor.isClient && Template.edit_btn,
                tmplContext( rowData ){
                    return {
                        item: rowData,
                        table: self
                    };
                }
            });
        }
    }

    _addInfoButton( o ){
        const self = this;
        const haveButton = this.opt( 'withInfoButton', true );
        //console.debug( 'infoButton', this.name, haveButton );
        if( haveButton ){
            o.columns.push({
                orderable: false,
                tmpl: Meteor.isClient && Template.info_btn,
                tmplContext( rowData ){
                    return {
                        item: rowData,
                        table: self
                    };
                }
            });
        }
    }

    constructor( o ){
        super( ...arguments );

        // keep the instanciation arguments
        this.#args = o;

        // add edition buttons unless otherwise requested
        this._addInfoButton( o );
        this._addEditButton( o );
        this._addDeleteButton( o );

        // track the 'rendered' var
        Tracker.autorun(() => {
            console.debug( 'pwix:tabular rendered', this.name, this.rendered());
        });

        return this;
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
    opt( name, def, rowData ){
        let res = this.arg( name );
        res = res ? (( typeof res === 'function' ) ? res( rowData ) : res ) : def;
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
