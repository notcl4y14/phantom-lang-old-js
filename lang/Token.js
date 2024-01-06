let Tools_toObject = require("../utils/tools.js").Tools_toObject;

let Token = class {
	constructor (type, value = null) {
		this.type = type;
		this.value = value;
	}

	// ---------------------------------------------------------------

	static Type = {
		Operator: 0,

		Number: 1,
		String: 2,
		Identifier: 3,
		Keyword: 4,
		Literal: 5,

		Dot: 6,
		Comma: 7,
		Colon: 8,
		Semicolon: 9,
		Not: 10,
		Ampersand: 11,
		Pipe: 12,

		Comment: 13,
		EOF: 14,
	};

	// ---------------------------------------------------------------

	matches (type, value) { return this.type == type && this.value == value; }
	string () { return Tools_toObject("Token", { type: this.type, value: this.value }); }
}

module.exports = Token;