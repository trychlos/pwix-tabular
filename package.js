Package.describe({
    name: 'pwix:tabular',
    version: '1.3.1-rc',
    summary: 'Extends aldeed:tabular package for our applications',
    git: 'https://github.com/trychlos/pwix-tabular.git',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'Tabular'
    ]);
    api.mainModule( 'src/client/js/index.js', 'client' );
    api.mainModule( 'src/server/js/index.js', 'server' );
});

Package.onTest( function( api ){
    configure( api );
    api.use( 'tinytest' );
    api.use( 'pwix:tabular' );
    api.mainModule( 'test/js/index.js' );
});

function configure( api ){
    const _use = function(){
        api.use( ...arguments );
        api.imply( ...arguments );
    };
    api.versionsFrom([ '2.9.0', '3.0-rc.0' ]);
    _use( 'aldeed:tabular@3.0.0-rc' );
    _use( 'check' );
    _use( 'blaze-html-templates@2.0.0 || 3.0.0-alpha300.0', 'client' );
    _use( 'ecmascript' );
    _use( 'less@4.0.0', 'client' );
    _use( 'pwix:bootbox@1.5.5' );
    _use( 'pwix:i18n@1.5.0' );
    _use( 'pwix:modal-info@1.4.0' );
    _use( 'pwix:ui-bootstrap5@2.0.0' );
    _use( 'pwix:ui-fontawesome6@1.0.0', 'client' );
    _use( 'reactive-var' );
    _use( 'tmeasday:check-npm-versions@1.0.2 || 2.0.0-beta.0', 'server' );
    _use( 'tracker' );
    api.addFiles( 'src/client/components/tabular_ext/tabular_ext.js', 'client' );
}

// NPM dependencies are checked in /src/server/js/check_npms.js
// See also https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies
