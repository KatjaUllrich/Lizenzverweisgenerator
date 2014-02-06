this.app = this.app || {};

app.Asset = ( function( $ ) {
'use strict';

/**
 * Represents a Commons asset.
 *
 * @param {string} title
 * @param {Object} [attributes]
 * @constructor
 */
var Asset = function( title, attributes ) {
	this._title = title;

	attributes = attributes || {};

	this._descriptions = attributes.descriptions || null;
	this._authors = attributes.authors || null;
	this._source = attributes.source || null;
	this._attribution = attributes.attribution || null;
};

$.extend( Asset.prototype, {
	/**
	 * @type {string}
	 */
	_title: null,

	/**
	 * @type {Object}
	 */
	_descriptions: null,

	/**
	 * @type {app.Author[]}
	 */
	_authors: null,

	/**
	 * @type {string}
	 */
	_source: null,

	/**
	 * @type {string}
	 */
	_attribution: null,

	/**
	 * @return {string}
	 */
	getTitle: function() {
		return this._title;
	},

	/**
	 * @return {Object}
	 */
	getDescriptions: function() {
		return this._descriptions;
	},

	/**
	 * @param {string} languageCode
	 * @return {string|null}
	 */
	getDescription: function( languageCode ) {
		if( !this._descriptions ) {
			return null;
		}
		return this._descriptions[languageCode] || null;
	},

	/**
	 * @param {options} [options]
	 * @return {string[]|string}
	 */
	getAuthors: function( options ) {
		options = options || {};

		if( !options.format !== 'string' ) {
			return this._authors;
		}

		return this._authors.join( '; ' );
	},

	/**
	 * @return {string}
	 */
	getSource: function() {
		return this._source;
	},

	/**
	 * @return {string}
	 */
	getAttribution: function() {
		return this._attribution;
	}

} );

return Asset;

}( jQuery ) );