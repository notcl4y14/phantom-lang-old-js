let Result = require("./Result.js");
let Token = require("./Token.js");
let Node = require("./Node.js");

let Parser = class {
	constructor(filename, tokens) {
		this.filename = filename;
		this.tokens = tokens;
		this.pos = -1;

		this.advance();
	}

	// ---------------------------------------------------------------

	getFilename() { return this.filename; }
	getTokens() { return this.tokens; }
	getPos() { return this.pos; }

	// ---------------------------------------------------------------

	at (delta = 0) { return this.tokens[this.pos + delta]; }

	advance (delta = 1) {
		let prev = this.at();
		this.pos += delta;
		return prev;
	}

	isEOF() { return this.at().matches(Token.Type.EOF); }

	// ---------------------------------------------------------------

	parse() {
		let res = new Result(this.filename);
		let program = new Node( Node.Type.Program, { body: [] } );

		while (!this.isEOF()) {
			let expr = res.register( this.parse_Expr() );
			if (res.error) return res;

			if (expr) program.body.push(expr);
		}

		return res.success(program);
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
		return this.parse_BinaryExpr("*/%", this.parse_PowerExpr);
	}

	parse_PowerExpr() {
		return this.parse_BinaryExpr(["^", "**"], this.parse_PrimaryExpr);
	}

	// ---------------------------------------------------------------

	parse_BinaryExpr(operators, func, include = true) {
		let res = new Result(this.filename);

		let left = res.register( func.call(this) );
		if (res.error) return res;

		while (
			!this.isEOF()
			&& this.at().matches(Token.Type.Operator, operators, include)
		) {
			let operator = this.advance().value;
			let right = res.register( func.call(this) );
			if (res.error) return res;

			return res.success( new Node( Node.Type.BinaryExpr, { left, operator, right, } ) );
		}

		return res.success(left);
	}

	// ---------------------------------------------------------------

	parse_PrimaryExpr() {
		let res = new Result(this.filename);

		let token = this.advance();
		let result = null;

		switch (token.type) {
			case Token.Type.Number: result = new Node( Node.Type.Number, { value: token.value } ); break;
			case Token.Type.String: result = new Node( Node.Type.String, { value: token.value } ); break;
			case Token.Type.Literal: result = new Node( Node.Type.Literal, { value: token.value } ); break;
			// case Token.Type.Operator:
				// result = res.register(this.parse_PrimaryOperator());
				// if (res.error) return res;
				// break;
		}

		return ( result == null )
			? res.failure(`Unexpected token '${token.value}'`, token.getPos())
			: res.success(result);
	}

	// parse_PrimaryOperator() {
		// let res = new Result(this.filename);

		// let token = this.at();
		// if (token.value != "^") return res.success();

		// return res.success(this.parse_BinaryExpr("^", this.parse_PrimaryExpr, false));
	// }
}

module.exports = Parser;