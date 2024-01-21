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
			let expr = res.register( this.Expr() );
			if (res.error) return res;

			if (expr) program.body.push(expr);
		}

		return res.success(program);
	}

	// ---------------------------------------------------------------

	Expr() {
		return this.AddExpr();
	}

	// TODO: Add the ability to reuse the same binary expressions
	AddExpr() {
		return this.BinaryExpr("+-", this.MultExpr);
	}

	MultExpr() {
		return this.BinaryExpr("*/%", this.PowerExpr);
	}

	PowerExpr() {
		return this.BinaryExpr(["^", "**"], this.PrimaryExpr);
	}

	// ---------------------------------------------------------------

	BinaryExpr(operators, func, include = true) {
		let res = new Result(this.filename);

		let left = res.register( func.call(this) );
		if (res.error) return res;

		while (
			!this.isEOF() &&
			this.at().matches(Token.Type.Operator, operators, include))
		{
			let operator = this.advance().value;
			let right = res.register( func.call(this) );
			if (res.error) return res;

			return res.success( new Node( Node.Type.BinaryExpr, { left, operator, right, } ) );
		}

		return res.success(left);
	}

	// ---------------------------------------------------------------

	PrimaryExpr() {
		let res = new Result(this.filename);
		let token = this.advance();

		switch (token.type) {
			case Token.Type.Number: return new Node( Node.Type.Number, { value: token.value } );
			case Token.Type.String: return new Node( Node.Type.String, { value: token.value } );
			case Token.Type.Literal: return new Node( Node.Type.Literal, { value: token.value } );
			case Token.Type.Paren:
				if (token.value == 1) break;

				let result = res.register(this.Expr());
				if (res.error) return res;

				if (!this.at().matches(Token.Type.Paren, 1)) {
					return res.failure(`Expected closing parenthesis`, this.at().getPos());
				}

				this.advance();

				return res.success(result);
		}

		return res.failure(`Unexpected token '${token.value}'`, token.getPos());
	}
}

module.exports = Parser;