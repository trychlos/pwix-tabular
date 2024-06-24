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
        const checked = this.item[this.field.name()];
        return checked ? 'checked' : '';
    },

    // whether the dt_checkbox is disabled ?
    enabled(){
        let enabled = this.enabled;
        if( enabled instanceof ReactiveVar ){
            enabled = enabled.get();
        } else if( typeof enabled === 'function' ){
            enabled = enabled( this );
        }
        return enabled ? '' : 'disabled' ;
    }
});

Template.dt_checkbox.events({
    'click .tabular-checkbox input'( event, instance ){
        // whether the checkbox is readonly ?
        let readonly = this.readonly;
        if( readonly instanceof ReactiveVar ){
            readonly = readonly.get();
        } else if( typeof readonly === 'function' ){
            readonly = readonly( this );
        }
        if( readonly ){
            return false;
        }
    }
});
