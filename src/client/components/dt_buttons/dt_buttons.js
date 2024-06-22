/*
 * pwix:tabular/src/client/components/dt_buttons/dt_buttons.js
 *
 * Data context is provided at the constructor level:
 * - item: the row data
 * - table: the Tabular.Table instance
 */

import '../delete_btn/delete_btn.js';
import '../edit_btn/edit_btn.js';
import '../info_btn/info_btn.js';

import './dt_buttons.html';

Template.dt_buttons.helpers({

    // whether have a delete button ?
    haveDeleteButton(){
        return this.table.opt( 'withDeleteButton', true );
    },

    // whether have an edit button ?
    haveEditButton(){
        return this.table.opt( 'withEditButton', true );
    },

    // whether have an info button ?
    haveInfoButton(){
        return this.table.opt( 'withInfoButton', true );
    }
});
