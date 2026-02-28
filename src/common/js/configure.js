/*
 * pwix:tabular/src/common/js/configure.js
 */

import _ from 'lodash';

import { Logger } from 'meteor/pwix:logger';
import { ReactiveVar } from 'meteor/reactive-var';

const logger = Logger.get();

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
        // check that keys exist
        let built_conf = {};
        Object.keys( o ).forEach(( it ) => {
            if( Object.keys( Tabular._defaults ).includes( it )){
                built_conf[it] = o[it];
            } else {
                logger.warn( 'configure() ignore unmanaged key \''+it+'\'' );
            }
        });
        if( Object.keys( built_conf ).length ){
            _conf = _.merge( Tabular._defaults, _conf, built_conf );
            Tabular._conf.set( _conf );
            logger.verbose({ verbosity: _conf.verbosity, against: Tabular.C.Verbose.CONFIGURE}, 'configure() with', built_conf );
        }
    }
    // also acts as a getter
    return Tabular._conf.get();
}

_conf = _.merge( {}, Tabular._defaults );
Tabular._conf.set( _conf );
