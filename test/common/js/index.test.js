
import { expect } from 'chai';
import sinon from 'sinon';

import { default as alTabular } from 'meteor/aldeed:tabular';
import { Tabular } from 'meteor/pwix:tabular';

import './functions';

describe( 'Tabular', () => {
    describe( 'Tabular - configure', () => {
        let warnStub;
        beforeEach( function(){
            warnStub = sinon.stub( console, 'warn' );
        });
        afterEach( function(){
            warnStub.restore();
        });
        it( 'is a function', () => {
            expect( Tabular.configure ).to.be.a( 'function' );
        });
        it( 'returns an object', () => {
            expect( Tabular.configure()).to.be.an( 'object' );
        });
        it( 'accepts \'hideDisabled\' key', () => {
            Tabular.configure({ hideDisabled: 1 });
            expect( warnStub.calledWithMatch( /ignore unmanaged/ )).to.be.false;
        });
        it( 'accepts \'verbosity\' key', () => {
            Tabular.configure({ verbosity: 1 });
            expect( warnStub.calledWithMatch( /ignore unmanaged/ )).to.be.false;
        });
        it( 'warns on any other key', () => {
            Tabular.configure({ another_key: 1 });
            expect( warnStub.calledWithMatch( /ignore unmanaged/ )).to.be.true;
        });
    });
    describe( 'Tabular - i18n.namespace', () => {
        it( 'is a function', () => {
            expect( Tabular.i18n.namespace ).to.be.a( 'function' );
        });
        it( 'returns a non empty string', () => {
            expect( Tabular.i18n.namespace()).to.be.a( 'string' ).and.not.empty;
        });
    });
    describe( 'Tabular - Table', () => {
        let warnStub;
        beforeEach( function(){
            warnStub = sinon.stub( console, 'warn' );
        });
        afterEach( function(){
            warnStub.restore();
        });
        it( 'is a function', () => {
            expect( Tabular.Table ).to.be.an( 'function' );
        });
        it( 'table name is mandatory', () => {
            expect( function(){ new Tabular.Table({ columns: [] })}).to.throw( Error, /must specify name/ );
        });
        it( 'columns list  is mandatory', () => {
            expect( function(){ new Tabular.Table({ name: 'name' })}).to.throw( Error, /must specify columns/ );
        });
        it( 'is an instance of Tabular.Table', () => {
            let table;
            expect( function(){ table = new Tabular.Table({ name: 'name', columns: [] })}).to.not.throw();
            expect( table ).to.be.an.instanceof( Tabular.Table );
        });
        it( 'is an instance of alTabular.Table', () => {
            let table;
            expect( function(){ table = new Tabular.Table({ name: 'name', columns: [] })}).to.not.throw();
            expect( table ).to.be.an.instanceof( alTabular.Table );
        });
        it( 'check for \'tabular\' sub-object deprecation', async () => {
            new Tabular.Table({ name: 'name', columns: [], tabular: {} });
            Tracker.flush();
            await new Promise( resolve => setTimeout( resolve, 0 ));
            expect( warnStub.calledWithMatch( /has been deprecated/ )).to.be.true;
        });
        it( 'check for \'pwix\' sub-object acceptance', async () => {
            new Tabular.Table({ name: 'name', columns: [], pwix: {} });
            Tracker.flush();
            await new Promise( resolve => setTimeout( resolve, 0 ));
            expect( warnStub.calledWithMatch( /has been deprecated/ )).to.be.false;
        });
    });
});
