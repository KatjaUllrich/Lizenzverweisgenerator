'use strict';

QUnit.module( 'AttributionDialogueView' );

var $ = require( 'jquery' ),
	AttributionDialogueView = require( '../../js/app/views/AttributionDialogueView' ),
	Messages = require( '../../js/app/Messages' );

$.fx.off = true;

function dialogueContains( $dialogue, message ) {
	return $dialogue.text().indexOf( Messages.t( message ) ) > -1;
}

QUnit.test( 'render should show the first step', function( assert ) {
	var $dialogue = $( '<div/>' );
	new AttributionDialogueView().render( $dialogue );

	assert.ok( dialogueContains( $dialogue, 'dialogue.type-of-use-headline' ) );
} );

QUnit.test( 'first step has two checkboxes', function( assert ) {
	var $dialogue = $( '<div/>' );
	new AttributionDialogueView().render( $dialogue );

	assert.equal( $dialogue.find( 'input[type="checkbox"]' ).length, 2 );
} );

function renderDialogueAtStep( n ) {
	var $dialogue = $( '<div/>' ),
		dialogue = new AttributionDialogueView();
	if( n > 3 ) {
		dialogue._dialogue._addEditingSteps();
	}
	dialogue._dialogue.setStep( n );
	dialogue.render( $dialogue );

	return { view: dialogue, dom: $dialogue };
}

QUnit.test( 'clicking a checkbox on first step submits and saves data', function( assert ) {
	var $dialogue = $( '<div/>' ),
		dialogue = new AttributionDialogueView();
	dialogue.render( $dialogue );

	$dialogue.find( 'input:checkbox' )[ 0 ].click();
	assert.equal( dialogue._dialogue.getData()[ 'typeOfUse' ][ 'type' ], 'print' );
} );

QUnit.test( 'submitting the form should renders second step', function( assert ) {
	var $dialogue = $( '<div/>' );
	new AttributionDialogueView().render( $dialogue );

	$dialogue.find( 'input[type="checkbox"]' )[ 0 ].click();
	assert.ok( dialogueContains( $dialogue, 'dialogue.author-headline' ) );
	assert.notOk( dialogueContains( $dialogue, 'dialogue.type-of-use-headline' ) );
} );

QUnit.test( 'Author Step', function( assert ) {
	var dialogue = renderDialogueAtStep( 1 );

	assert.equal( dialogue.dom.find( 'input:checkbox' ).length, 1 );
	assert.equal( dialogue.dom.find( 'input:text' ).length, 1 );

	dialogue.dom.find( 'input:checkbox' ).click();
	assert.equal( dialogue.view._dialogue.getData()[ 'author' ][ 'no-author' ], 'true' );

	dialogue = renderDialogueAtStep( 1 );
	dialogue.dom.find( 'input:text' ).val( 'Blah' );
	dialogue.dom.find( 'button' ).click();
	assert.equal( dialogue.view._dialogue.getData()[ 'author' ][ 'author' ], 'Blah' );
} );

QUnit.test( 'Compilation Step', function( assert ) {
	var dialogue = renderDialogueAtStep( 2 );

	assert.equal( dialogue.dom.find( 'input:checkbox' ).length, 2 );

	dialogue.dom.find( 'input:checkbox' )[ 0 ].click();
	assert.equal( dialogue.view._dialogue.getData()[ 'compilation' ][ 'compilation' ], 'true' );

	dialogue = renderDialogueAtStep( 2 );
	dialogue.dom.find( 'input:checkbox' )[ 1 ].click();
	assert.equal( dialogue.view._dialogue.getData()[ 'compilation' ][ 'compilation' ], 'false' );
} );

QUnit.test( 'Editing Step', function( assert ) {
	var dialogue = renderDialogueAtStep( 3 );

	assert.equal( dialogue.dom.find( 'input:checkbox' ).length, 2 );

	dialogue.dom.find( 'input:checkbox' )[ 0 ].click();
	assert.equal( dialogue.view._dialogue.getData()[ 'editing' ][ 'edited' ], 'true' );

	dialogue = renderDialogueAtStep( 3 );
	dialogue.dom.find( 'input:checkbox' )[ 1 ].click();
	assert.equal( dialogue.view._dialogue.getData()[ 'editing' ][ 'edited' ], 'false' );
} );

QUnit.test( 'Change Step', function( assert ) {
	var dialogue = renderDialogueAtStep( 4 );

	assert.equal( dialogue.dom.find( 'input:text' ).length, 1 );

	dialogue.dom.find( 'input:text' ).val( 'cropped' );
	dialogue.dom.find( 'button' ).click();
	assert.equal( dialogue.view._dialogue.getData()[ 'change' ][ 'change' ], 'cropped' );
} );

QUnit.test( 'Creator Step', function( assert ) {
	var dialogue = renderDialogueAtStep( 5 );

	assert.equal( dialogue.dom.find( 'input:text' ).length, 1 );

	dialogue.dom.find( 'input:text' ).val( 'Meh' );
	dialogue.dom.find( 'button' ).click();
	assert.equal( dialogue.view._dialogue.getData()[ 'creator' ][ 'name' ], 'Meh' );
} );

QUnit.test( 'Dialogue walkthrough', function( assert ) {
	var $dialogue = $( '<div/>' ),
		dialogue = new AttributionDialogueView();
	dialogue.render( $dialogue );

	// Type of Use Step
	$dialogue.find( 'input:checkbox' )[ 1 ].click();

	// Author Step
	$dialogue.find( 'input:text' ).val( 'Blah' );
	$dialogue.find( 'button' ).click();

	// Compilation Step
	$dialogue.find( 'input:checkbox' )[ 0 ].click();

	// Editing Step
	$dialogue.find( 'input:checkbox' )[ 0 ].click();

	// Change Substep
	$dialogue.find( 'input:text' ).val( 'cropped' );
	$dialogue.find( 'button' ).click();

	// Creator Substep
	assert.equal( $dialogue.find( 'input:text' ).length, 1 );

	$dialogue.find( 'input:text' ).val( 'Meh' );
	$dialogue.find( 'button' ).click();

	assert.equal( dialogue._dialogue.getData()[ 'typeOfUse' ][ 'type' ], 'online' );
	assert.equal( dialogue._dialogue.getData()[ 'author' ][ 'author' ], 'Blah' );
	assert.equal( dialogue._dialogue.getData()[ 'compilation' ][ 'compilation' ], 'true' );
	assert.equal( dialogue._dialogue.getData()[ 'editing' ][ 'edited' ], 'true' );
	assert.equal( dialogue._dialogue.getData()[ 'change' ][ 'change' ], 'cropped' );
	assert.equal( dialogue._dialogue.getData()[ 'creator' ][ 'name' ], 'Meh' );
} );

QUnit.test( 'show done after completing last step', function( assert ) {
	var dialogue = renderDialogueAtStep( 3 );
	dialogue.dom.find( 'input:checkbox' )[ 1 ].click();
	assert.ok( dialogueContains( dialogue.dom, 'dialogue.done-headline' ) );
} );