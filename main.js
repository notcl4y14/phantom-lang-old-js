let Lexer = require("./lang/Lexer.js");

let main = function() {
	let lexer = new Lexer("<stdin>", "10+2 -3/ 4 + 1.5 'Hello World!' `lol` \"a\" lol_fooBar123 Variable π_number is_identifier? let var if else undefined null true false");
	let tokens = lexer.lexerize();

	tokens.forEach ((token) => console.log(token.string()));
}

main();