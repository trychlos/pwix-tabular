/*
 * pwix:tabular/src/server/js/check_npms.js
 */

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

if( false ){
    // whitelist packages which are included via a subfolder or badly recognized
    require( 'datatables.net-bs5/package.json' );
    require( 'datatables.net-buttons-bs5/package.json' );
    require( 'datatables.net-colreorder-bs5/package.json' );
    require( 'datatables.net-fixedheader-bs5/package.json' );
    require( 'datatables.net-responsive-bs5/package.json' );
    require( 'datatables.net-rowgroup-bs5/package.json' );
    require( 'datatables.net-scroller-bs5/package.json' );
}

checkNpmVersions({
    'datatables.net-bs5': '^2.0.8',
    'datatables.net-buttons-bs5': '^3.0.2',
    'datatables.net-colreorder-bs5': '^2.0.3',
    'datatables.net-fixedheader-bs5': '^4.0.1',
    'datatables.net-responsive-bs5': '^3.0.2',
    'datatables.net-rowgroup-bs5': '^1.5.0',
    'datatables.net-scroller-bs5': '^2.4.3',
    'lodash': '^4.17.0',
},
    'pwix:tabular'
);
