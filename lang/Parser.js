let Token = require("./Token.js");

let Parser = class {
	constructor(filename, tokens) {
		this.filename = filename;
		this.tokens = tokens;
		this.position = -1;

		this.advance();
	}

	// ---------------------------------------------------------------

	getFilename() { return this.filename; }
	getTokens() { return this.tokens; }
	getPosition() { return this.position; }

	// ---------------------------------------------------------------

	at (delta = 0) { return this.tokens[this.position + delta]; }
	advance (delta = 1) {
		let prev = this.at();
		this.position += delta;
		return prev;
	}
	isEOF() { return this.at().matches(Token.Type.EOF); }

	// ---------------------------------------------------------------

	parse() {
		let program = {
			type: "Program",
			body: [],
		};

		while (!this.isEOF()) {
			let expr = this.parse_Expr();
			if (expr) program.body.push(expr);
		}

		return program;
	}

	// ---------------------------------------------------------------

	parse_Expr() {
		return this.parse_AddExpr();
	}

	// TODO: Add the ability to reuse the same binary expressions
	parse_AddExpr() {
		return this.parse_BinaryExpr("+-", this.parse_MultExpr);
	}

	parse_MultExpr() {
		return this.parse_BinaryExpr("*/%", this.parse_PrimaryExpr);
	}

	// ---------------------------------------------------------------

	parse_BinaryExpr(operators, func) {
		let left = func.call(this);

		while (!this.isEOF() && this.at().matches(Token.Type.Operator, operators, true)) {
			let operator = this.advance().value;
			let right = func.call(this);

			return {
				type: "BinaryExpr",
				left, operator, right,
			};
		}

		return left;
	}

	// ---------------------------------------------------------------

	parse_PrimaryExpr() {
		let token = this.advance();

		switch (token.type) {
			case Token.Type.Number: return { type: "Number", value: token.value };
		}
	}
}

module.exports = Parser;