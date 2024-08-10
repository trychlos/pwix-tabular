/*
 * pwix:tabular/src/client/components/dt_checkbox/dt_checkbox.js
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - field: the Field.Def definition
 * - enabled: a Boolean, or a ReactiveVar or a function which returns a Boolean or a ReactiveVar
 * - readonly: a Boolean, or a ReactiveVar or a function which returns a Boolean or a ReactiveVar
 */

import { ReactiveVar } from 'meteor/reactive-var';

import './dt_checkbox.html';

Template.dt_checkbox.helpers({
    // whether the dt_checkbox is checked ?
    checked(){
        //console.debug( this );
        const checked = this.item[this.field.name()];
        return checked ? 'checked' : '';
    },

    // whether the dt_checkbox is disabled ?
    enabled(){
        let status = this.enabled;
        if( status instanceof ReactiveVar ){
            status = status.get();
        } else if( typeof status === 'function' ){
            status = status( this );
        }
        return status ? '' : 'disabled' ;
    },

    // whether the dt_checkbox is read-only ?
    readOnly(){
        let readonly = this.readonly;
        if( readonly instanceof ReactiveVar ){
            readonly = readonly.get();
        } else if( typeof readonly === 'function' ){
            readonly = readonly( this );
        }
        return readonly ? 'readonly' : '' ;
    }
});

Template.dt_checkbox.events({
    'click .tabular-checkbox input'( event, instance ){
        // whether the checkbox is readonly ?
        let status = this.readonly;
        if( status instanceof ReactiveVar ){
            status = status.get();
        } else if( typeof status === 'function' ){
            status = status( this );
        }
        if( status ){
            return false;
        }
    }
});
