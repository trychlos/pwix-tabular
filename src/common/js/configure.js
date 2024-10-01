/*
 * pwix:tabular/src/common/js/configure.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

let _conf = {};
Tabular._conf = new ReactiveVar( _conf );

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
        _conf = _.merge( Tabular._defaults, _conf, o );
        Tabular._conf.set( _conf );
        // be verbose if asked for
        if( Tabular._conf.verbosity & Tabular.C.Verbose.CONFIGURE ){
            console.log( 'pwix:forms configure() with', o );
        }
    }
    // also acts as a getter
    return Tabular._conf.get();
}

_conf = _.merge( {}, Tabular._defaults );
Tabular._conf.set( _conf );
