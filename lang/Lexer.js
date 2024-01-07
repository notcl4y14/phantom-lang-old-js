let Token = require("./Token.js");

let Lexer = class {
	constructor(filename, code) {
		this.filename = filename;
		this.code = code;
		this.position = -1;

		this.advance();
	}

	// ---------------------------------------------------------------

	getFilename() { return this.filename; }
	getCode() { return this.code; }
	getPosition() { return this.position; }

	// ---------------------------------------------------------------

	at(range = 0) { return range == 0 ? this.getCode()[this.getPosition()] : this.getCode().substr(this.getPosition(), range); }
	advance (delta = 1) { this.position += delta; }
	isEOF() { return this.getPosition() >= this.getCode().length; }

	// ---------------------------------------------------------------

	lexerize() {
		let tokens = [];

		while ( !this.isEOF() ) {
			let token = this.lexerize_Token();
			if (token) tokens.push(token);
			this.advance();
		}

		tokens.push ( new Token(Token.Type.EOF) );

		return tokens;
	}

	lexerize_Token() {
		let char = this.at();

		if ( (" \t\r\n").includes(this.at()) ) {
			return;

		} else if ( ["+=", "-=", "*=", "/=", "%=", "^=", "<=", ">=", "==", "!="].includes(this.at(2)) ) {
			let value = this.at(2);
			this.advance();
			return new Token (Token.Type.Operator, value);

		// ----------------------------------------------------------

		} else if ( ("+-*/%^<>=").includes(char) ) {
			return new Token (Token.Type.Operator, char);

		} else if ( (".,:;!&|()[]{}").includes(char) ) {
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

		} else if ( ("1234567890").includes(char) ) {
			return this.lexerize_Number();

		} else if ( ("\"'`").includes(char) ) {
			return this.lexerize_String();

		} else {
			return this.lexerize_Identifier();
		}

		return null;
	}

	lexerize_Number() {
		let numStr = "";
		let dot = false;

		while (!this.isEOF() && ("1234567890.").includes(this.at())) {
			numStr += this.at();

			if (this.at() == ".") {
				if (dot) break;
				dot = true;
			}

			this.advance();
		}

		this.advance(-1);

		return new Token(Token.Type.Number, Number(numStr));
	}

	lexerize_String() {
		let quote = this.at();
		let str = "";

		this.advance();

		while (!this.isEOF() && this.at() != quote) {
			str += this.at();
			this.advance();
		}

		return new Token(Token.Type.String, str);
	}

	lexerize_Identifier() {
		let identStr = "";

		while (!this.isEOF() && !Token.IdentifierBreak.includes(this.at()) ) {
			identStr += this.at();
			this.advance();
		}

		if (Token.Keywords.includes(identStr)) {
			return new Token(Token.Type.Keyword, identStr);

		} else if (Token.Literals.includes(identStr)) {
			return new Token(Token.Type.Literal, identStr);
		}

		return new Token(Token.Type.Identifier, identStr);
	}
}

module.exports = Lexer;