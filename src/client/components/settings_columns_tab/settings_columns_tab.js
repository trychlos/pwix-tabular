/*
 * /imports/client/components/settings_columns_tab/settings_columns_tab.js
 *
 * Parms:
 * - table: the Table instance
 * - checker: a ReactiveVar which contains the parent checker
 * - columnsRv: a ReactiveVar which contains the currently visible columns as an array
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Logger } from 'meteor/pwix:logger';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './settings_columns_tab.html';

const logger = Logger.get();

Template.settings_columns_tab.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.PCK = {
        // the sorted names of defined columns
        allNames: new ReactiveVar( null ),
        // updated on each selection/deselection the name of the column and the enclosing list
        selectedName: new ReactiveVar( null ),
        $selectedList: new ReactiveVar( null ),

        // retrieve the definition of the named column
        columnByName( name, dc ){
            for( const column of dc.table.options.columns ){
                if( column.name === name ){
                    return column;
                }
            }
            logger.warning( 'unable to get back the named column', name );
            return null;
        },

        // whether the named reference column can be selected
        //  yes unless it is a hidden field, or a group (but groups have already been filtered from options.columns)
        isColumnSelectable( name, dc ){
            const column = self.PCK.columnByName( name, dc );
            if( !column ){
                return false;
            }
            if( column.hidden ){
                return false;
            }
            return true;
        },

        // whether the named reference column has already been selected
        isColumnSelected( name, dc ){
            return dc.columnsRv.get().includes( name );
        },

        // update currently select column name and enclosing list
        updateSelected(){
            let name = null;
            let $list = null;
            const $selected = self.$( '.tabular-settings-columns-tab' ).find( '.form-label.selected' );
            if( $selected && $selected.length ){
                name = $selected.text();
                $list = $selected.closest( '.list' );
                if( $list && !$list.length ){
                    logger.warning( 'unable to find the hosting list for selected', $selected );
                    $list = null;
                }
            }
            self.PCK.$selectedList.set( $list );
            self.PCK.selectedName.set( name );
        },
    };

    // when data context is ready, setup our reference names
    self.autorun(() => {
        const dc = Template.currentData();
        if( dc.table ){
            let names = [];
            for( const column of dc.table.options.columns ){
                names.push( column.name );
            }
            self.PCK.allNames.set( names.sort());
        }
    });
});

Template.settings_columns_tab.onRendered( function(){
    const self = this;
});

Template.settings_columns_tab.helpers({
    // the list of chosen columns
    editionList(){
        //return Template.instance().PCK.columns;
        return this.columnsRv.get();
    },

    // the from-edition button is enabled is the currently selected item is on the right list
    fromEditionEnabled(){
        const $list = Template.instance().PCK.$selectedList.get();
        return $list && $list.hasClass( 'edition' ) ? '' : 'disabled';
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // disable reference items which are not selectable or already selected
    itEnabled( it ){
        const selectable = Template.instance().PCK.isColumnSelectable( it, this );
        const selected = Template.instance().PCK.isColumnSelected( it, this );
        return selectable && !selected ? '' : 'disabled';
    },

    // return the item identifier - which happens to be the column name
    itId( it ){
        return it;
    },

    // return the item label - which happens to be the column name
    itLabel( it ){
        return it;
    },

    // return the list of the known columns
    referenceList(){
        return Template.instance().PCK.allNames.get();
    },

    // the to-down button is enabled is the currently selected item is on the right list and not the last one
    toDownEnabled(){
        const $list = Template.instance().PCK.$selectedList.get();
        let enabled = false;
        if( $list && $list.hasClass( 'edition' )){
            const name = Template.instance().PCK.selectedName.get();
            const columns = this.columnsRv.get();
            const index = columns.indexOf( name );
            //logger.debug( 'columns.length', columns.length, 'index', index );
            enabled = index < columns.length-1;
        }
        return enabled ? '' : 'disabled';
    },

    // the to-edition button is enabled is the currently selected item is on the left list
    toEditionEnabled(){
        const $list = Template.instance().PCK.$selectedList.get();
        return $list && $list.hasClass( 'reference' ) ? '' : 'disabled';
    },

    // the to-up button is enabled is the currently selected item is on the right list and not the first one
    toUpEnabled(){
        const $list = Template.instance().PCK.$selectedList.get();
        let enabled = false;
        if( $list && $list.hasClass( 'edition' )){
            const name = Template.instance().PCK.selectedName.get();
            const index = this.columnsRv.get().indexOf( name );
            //logger.debug( 'name', name, 'index', index );
            enabled = index > 0;
        }
        return enabled ? '' : 'disabled';
    }
});

Template.settings_columns_tab.events({
    // click on a label in a list
    'click .list .form-label'( event, instance ){
        const selected = instance.$( event.currentTarget ).hasClass( 'selected' );
        const selectable = !instance.$( event.currentTarget ).hasClass( 'disabled' );
        const $list = instance.$( event.currentTarget ).closest( '.container' );
        $list.find( '.form-label' ).removeClass( 'selected' );
        if( !selected && selectable ){
            instance.$( event.currentTarget ).addClass( 'selected' );
        }
        instance.PCK.updateSelected();
    },

    // add a column to the edition list
    //  and unselect the currently selected item
    'click .to-edition'( event, instance ){
        const name = instance.PCK.selectedName.get();
        if( name ){
            const columns = this.columnsRv.get();
            columns.push( name );
            this.columnsRv.set( columns );
            instance.$( event.currentTarget ).closest( '.container' ).find( '.form-label' ).removeClass( 'selected' );
            instance.PCK.updateSelected();
        } else {
            logger.warning( 'name is not set, but should' );
        }
    },

    // remove a column from the edition list
    'click .from-edition'( event, instance ){
        const name = instance.PCK.selectedName.get();
        if( name ){
            const columns = this.columnsRv.get();
            const index = columns.indexOf( name );
            if( index >= 0 ){
                columns.splice( index, 1 );
                this.columnsRv.set( columns );
                instance.$( event.currentTarget ).closest( '.container' ).find( '.form-label' ).removeClass( 'selected' );
                instance.PCK.updateSelected();
            } else {
                logger.warning( 'name not found in edition list', name );
            }
        } else {
            logger.warning( 'name is not set, but should' );
        }
    },

    // move a column down
    'click .to-down'( event, instance ){
        const name = instance.PCK.selectedName.get();
        if( name ){
            const columns = this.columnsRv.get();
            const index = columns.indexOf( name );
            if( index >= 0 && index < columns.length-1){
                columns.splice( index, 1 );
                columns.splice( index+1, 0, name );
                this.columnsRv.set( columns );
            } else {
                logger.warning( 'name not found in edition list', name );
            }
        } else {
            logger.warning( 'name is not set, but should' );
        }
    },

    // move a column up
    'click .to-up'( event, instance ){
        const name = instance.PCK.selectedName.get();
        if( name ){
            const columns = this.columnsRv.get();
            const index = columns.indexOf( name );
            if( index > 0 ){
                columns.splice( index, 1 );
                columns.splice( index-1, 0, name );
                this.columnsRv.set( columns );
            } else {
                logger.warning( 'name not found in edition list', name );
            }
        } else {
            logger.warning( 'name is not set, but should' );
        }
    }
});
