let Position = require("./Position.js");
let Token = require("./Token.js");

let Lexer = class {
	constructor(filename, code) {
		this.filename = filename;
		this.code = code;
		this.pos = new Position(-1, 0, -1);

		this.advance();
	}

	// ---------------------------------------------------------------

	getFilename() { return this.filename; }
	getCode() { return this.code; }
	getPos() { return this.pos; }

	// ---------------------------------------------------------------

	at(range = 0) {
		return (range == 0)
			? this.getCode()[ this.getPos().index ]
			: this.getCode().substr( this.getPos().index, range );
	}

	advance (delta = 1) {
		this.pos.advance ( this.at(), delta );
	}

	isEOF() {
		return this.getPos().index >= this.getCode().length;
	}

	// ---------------------------------------------------------------

	lexerize() {
		let tokens = [];

		while ( !this.isEOF() ) {

			// Getting left pos and token
			let pos = this.getPos().clone();
			let token = this.lexerize_Token();

			if (!token) {
				this.advance();
				continue;
			}

			// Checking for positions
			if (!token.pos[0])
				token.pos[0] = pos;

			if (!token.pos[1])
				token.pos[1] = pos.clone().advance();

			// Pushing
			if (token) tokens.push(token);
			this.advance();

		}

		tokens.push ( new Token(Token.Type.EOF).setPosition(this.pos.clone(), this.pos.clone()) );

		return tokens;
	}

	lexerize_Token() {
		let char = this.at();

		if ( (" \t\r\n").includes(this.at()) ) {
			return;

		} else if ( Token.ThreeCharOp.includes(this.at(3)) ) {
			let value = this.at(3);
			this.advance(2);
			return new Token (Token.Type.Operator, value);

		} else if ( Token.MultiCharOp.includes(this.at(2)) ) {
			let value = this.at(2);
			this.advance();
			return new Token (Token.Type.Operator, value);

		// ----------------------------------------------------------

		} else if ( Token.Op.includes(char) ) {
			return new Token (Token.Type.Operator, char);

		} else if ( Token.Symbols.includes(char) ) {
			switch (char) {
				case ".": return new Token (Token.Type.Dot);
				case ",": return new Token (Token.Type.Comma);
				case ":": return new Token (Token.Type.Colon);
				case ";": return new Token (Token.Type.Semicolon);
				case "!": return new Token (Token.Type.Not);
				case "&": return new Token (Token.Type.Ampersand);
				case "|": return new Token (Token.Type.Pipe);

				case "(": return new Token(Token.Type.Paren, 0);
				case ")": return new Token(Token.Type.Paren, 1);
				case "[": return new Token(Token.Type.Bracket, 0);
				case "]": return new Token(Token.Type.Bracket, 1);
				case "{": return new Token(Token.Type.Brace, 0);
				case "}": return new Token(Token.Type.Brace, 1);
			}

		// ----------------------------------------------------------

		} else if ( Token.Digits.includes(char) ) {
			return this.lexerize_Number();

		} else if ( Token.Quotes.includes(char) ) {
			return this.lexerize_String();

		} else {
			return this.lexerize_Identifier();
		}

		return ;
	}

	lexerize_Number() {
		let leftPos = this.pos.clone();
		let numStr = "";
		let dot = false;

		// ---------------------------

		while (!this.isEOF() && ("1234567890.").includes(this.at())) {
			numStr += this.at();

			if (this.at() == ".") {
				if (dot) break;
				dot = true;
			}

			this.advance();
		}

		// ---------------------------

		let rightPos = this.pos.clone();
		this.advance(-1);

		// ---------------------------

		return new Token(Token.Type.Number, Number(numStr))
			.setPosition(leftPos, rightPos);
	}

	lexerize_String() {
		let leftPos = this.pos.clone();
		let quote = this.at();
		let str = "";

		this.advance();

		// ---------------------------

		while (!this.isEOF() && this.at() != quote) {
			str += this.at();
			this.advance();
		}

		// ---------------------------

		let rightPos = this.pos.clone();

		// ---------------------------

		return new Token(Token.Type.String, str)
			.setPosition(leftPos, rightPos);
	}

	lexerize_Identifier() {
		let leftPos = this.pos.clone();
		let identStr = "";

		// ---------------------------

		while (!this.isEOF() && !Token.IdentifierBreak.includes(this.at()) ) {
			identStr += this.at();
			this.advance();
		}

		// ---------------------------

		let rightPos = this.pos.clone();
		this.advance(-1);

		// ---------------------------

		if (Token.Keywords.includes(identStr)) {
			return new Token(Token.Type.Keyword, identStr)
				.setPosition(leftPos, rightPos);

		} else if (Token.Literals.includes(identStr)) {
			return new Token(Token.Type.Literal, identStr)
				.setPosition(leftPos, rightPos);
		}

		return new Token(Token.Type.Identifier, identStr)
			.setPosition(leftPos, rightPos);
	}
}

module.exports = Lexer;