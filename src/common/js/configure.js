/*
 * pwix:tabular/src/common/js/configure.js
 */

import _ from 'lodash';

Tabular._conf = {};

Tabular._defaults = {
    hideDisabled: true,
    verbosity: Tabular.C.Verbose.CONFIGURE
};

/**
 * @summary Get/set the package configuration
 *  Should be called *in same terms* both by the client and the server.
 * @param {Object} o configuration options
 * @returns {Object} the package configuration
 */
Tabular.configure = function( o ){
    if( o && _.isObject( o )){
        _.merge( Tabular._conf, Tabular._defaults, o );
        // be verbose if asked for
        if( Tabular._conf.verbosity & Tabular.C.Verbose.CONFIGURE ){
            console.log( 'pwix:forms configure() with', o );
        }
    }
    // also acts as a getter
    return Tabular._conf;
}

_.merge( Tabular._conf, Tabular._defaults );
