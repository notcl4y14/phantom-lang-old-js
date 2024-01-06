let Lexer = require("./lang/Lexer.js");

let main = function() {
	let lexer = new Lexer("<stdin>", "+-*/%^ += -= *= /= %= ^= < > = .,:;!&|");
	let tokens = lexer.lexerize();

	tokens.forEach ((token) => console.log(token.string()));
}

main();