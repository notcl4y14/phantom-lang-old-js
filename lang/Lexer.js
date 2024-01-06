let Token = require("./Token.js");

let Lexer = class {
	constructor(filename, code) {
		this.filename = filename;
		this.code = code;
		this.position = -1;
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

		if ( ["+=", "-=", "*=", "/=", "%=", "^=", "<=", ">=", "==", "!="].includes(this.at(2)) ) {
			let value = this.at(2);
			this.advance();
			return new Token (Token.Type.Operator, value);

		} else if ( ("+-*/%^<>=").includes(char) ) {
			return new Token (Token.Type.Operator, char);

		} else if ( (".,:;!&|").includes(char) ) {
			switch (char) {
				case ".": return new Token (Token.Type.Dot);
				case ",": return new Token (Token.Type.Comma);
				case ":": return new Token (Token.Type.Colon);
				case ";": return new Token (Token.Type.Semicolon);
				case "!": return new Token (Token.Type.Not);
				case "&": return new Token (Token.Type.Ampersand);
				case "|": return new Token (Token.Type.Pipe);
			}
		}

		return null;
	}
}

module.exports = Lexer;