// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by tabular.js.
import { name as packageName } from "meteor/pwix:tabular";

// Write your tests here!
// Here is an example.
Tinytest.add( 'tabular - example', function( test ){
    test.equal( packageName, 'tabular' );
});
