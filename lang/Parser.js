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

	getFilename() {
		return this.filename;
	}
	getTokens() {
		return this.tokens;
	}
	getPos() {
		return this.pos;
	}

	// ---------------------------------------------------------------

	at(delta = 0) {
		return this.tokens[this.pos + delta];
	}

	advance(delta = 1) {
		let prev = this.at();
		this.pos += delta;
		return prev;
	}

	isEOF() {
		return this.at().matches(Token.Type.EOF);
	}

	// ---------------------------------------------------------------

	parse() {
		let res = new Result(this.filename);
		let program = new Node(Node.Type.Program, {
			body: []
		}, [
			this.tokens[0].pos[0],
			this.tokens[this.tokens.length - 1].pos[1]
		]);

		while (!this.isEOF()) {
			let expr = res.register(this.Stmt());
			if (res.error) return res;

			if (expr) program.body.push(expr);
		}

		return res.success(program);
	}

	// ---------------------------------------------------------------

	getValueType() {
		if (this.at().matches(Token.Type.Colon)) this.advance();
		let type = this.advance().value;

		// type = RuntimeValue.Type[RuntimeValue.StrType[type]];
		// let override = RuntimeValue.getTypeFromStr(type);
		// if (override) type = override;

		return type;
	}

	// ---------------------------------------------------------------

	Stmt() {
		if (this.at().matches(Token.Type.Keyword, ["let", "var"], true)) {
			return this.VarDeclaration();
		}

		return this.Expr();
	}

	VarDeclaration() {
		// if (this.at().matches(Token.Type.Keyword, ["let", "var"], true)) this.advance();

		let res = new Result(this.filename);
		let keyword = this.advance();
		let type = "dynamic";

		let name = res.register(this.Expr());
		if (res.error) return res;

		if (name.type != Node.Type.Identifier) return res.failure("Expected identifier", name.pos);

		if (this.at().matches(Token.Type.Colon))
			type = this.getValueType();

		if (!this.at().matches(Token.Type.Operator, "=")) {
			let node = new Node(Node.Type.VarDeclaration, {
				name,
				runtime_type: type,
				value: new Node(Node.Type.Literal, {
					value: "null"
				}),
			}, [keyword.pos[0], name.pos[1]]);

			return res.success(node);
		}

		this.advance();

		let value = res.register(this.Expr());
		if (res.error) return res;

		let node = new Node(Node.Type.VarDeclaration, {
			name,
			runtime_type: type,
			value: value,
		}, [keyword.pos[0], value.pos[1]]);

		return res.success(node);
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

		let left = res.register(func.call(this));
		if (res.error) return res;

		while (!this.isEOF() &&
			this.at().matches(Token.Type.Operator, operators, include)) {
			let operator = this.advance().value;
			let right = res.register(func.call(this));
			if (res.error) return res;

			let node = new Node(Node.Type.BinaryExpr, {
				left,
				operator,
				right
			}, [left.pos[0], right.pos[1]]);
			return res.success(node);
		}

		return res.success(left);
	}

	// ---------------------------------------------------------------

	PrimaryExpr() {
		let res = new Result(this.filename);
		let token = this.advance();

		switch (token.type) {
			case Token.Type.Number:
				return new Node(Node.Type.Number, {
					value: token.value
				}, [token.pos[0], token.pos[1]]);
			case Token.Type.String:
				return new Node(Node.Type.String, {
					value: token.value
				}, [token.pos[0], token.pos[1]]);
			case Token.Type.Literal:
				return new Node(Node.Type.Literal, {
					value: token.value
				}, [token.pos[0], token.pos[1]]);
			case Token.Type.Identifier:
				return new Node(Node.Type.Identifier, {
					value: token.value
				}, [token.pos[0], token.pos[1]]);
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