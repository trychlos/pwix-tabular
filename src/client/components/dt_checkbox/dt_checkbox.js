/*
 * pwix:tabular/src/client/components/dt_checkbox/dt_checkbox.js
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - field: the Field.Def definition
 * - enabled: a Boolean, or a ReactiveVar or a function which returns a Boolean or a ReactiveVar, defaulting to true
 * - readonly: a Boolean, or a ReactiveVar or a function which returns a Boolean or a ReactiveVar, defaulting to true
 * - onCheck: a function called with the 'checked' prop
 */

import { Logger } from 'meteor/pwix:logger';
import { ReactiveVar } from 'meteor/reactive-var';

import './dt_checkbox.html';

const logger = Logger.get();

Template.dt_checkbox.onCreated( function(){
    const self = this;

    self.PCK = {
        // whether the checkbox is enabled ?
        isEnabled( dc ){
            let status = Object.keys( dc ).includes( 'enabled' ) ? dc.enabled : true;
            if( status instanceof ReactiveVar ){
                status = status.get();
            } else if( typeof status === 'function' ){
                status = status( dc );
            }
            return status;
        },

        // whether the checkbox is read-only ?
        isReadonly( dc ){
            let status = Object.keys( dc ).includes( 'readonly' ) ? dc.readonly : true;
            if( status instanceof ReactiveVar ){
                status = status.get();
            } else if( typeof status === 'function' ){
                status = status( dc );
            }
            return status;
        }
    };
});

Template.dt_checkbox.helpers({
    // whether the dt_checkbox is checked ?
    checked(){
        const checked = this.item[this.field.name()];
        return checked ? 'checked' : '';
    },

    // whether the dt_checkbox is enabled ?
    enabled(){
        return Template.instance().PCK.isEnabled( this ) ? '' : 'disabled' ;
    },

    // whether the dt_checkbox is read-only ?
    readOnly(){
        return Template.instance().PCK.isReadonly( this ) ? 'readonly' : '' ;
    }
});

Template.dt_checkbox.events({
    'click .tabular-checkbox input'( event, instance ){
        if( instance.PCK.isReadonly( this )){
            return false;
        }
        // honors the 'onCheck' parameter
        const onCheck = this.onCheck;
        const checked = instance.$( event.currentTarget ).prop( 'checked' );
        if( onCheck && typeof onCheck === 'function' ){
            onCheck( this, checked );
        }
        // trigger a dedicated event
        instance.$( event.currentTarget ).trigger( 'tabular-click-event', { item: this.item, field: this.field, checked: checked });
    }
});
