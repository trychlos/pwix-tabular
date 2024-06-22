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

    _addButtonsColumn( o ){
        const self = this;
        Tracker.autorun(() => {
            const haveAnyButton = self.opt( 'withDeleteButton', true ) || self.opt( 'withEditButton', true ) || self.opt( 'withInfoButton', true );
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

    constructor( o ){
        super( ...arguments );

        // keep the instanciation arguments
        this.#args = o;

        // add edition buttons unless otherwise requested
        this._addButtonsColumn( o );

        // track the 'rendered' state
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
