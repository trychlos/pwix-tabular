/*
 * pwix:tabular/src/common/js/constants.js
 */

Tabular.C = {
    // menu items
    Items: {
        COLUMN_SELECTION:   'COLUMN_SELECTION',
        DIVIDER:            'DIVIDER',
        TABULAR_SETTINGS:   'TABULAR_SETTINGS'
    },

    // verbosity levels
    Verbose: {
        NONE: 0,
        CONFIGURE:      0x01 <<  0
    },

    // where to insert additional buttons
    Where: {
        AFTER:  'AFTER',
        BEFORE: 'BEFORE'
    }
};

// non exported variables

I18N = 'pwix:tabular:i18n:namespace';

COOKIE_RESPONSIBLE = 'pwix:tabular';
COOKIE_COLUMNS = 'tabular-columns';
COOKIE_ROWS_PER_PAGE = 'rows-per-page';
