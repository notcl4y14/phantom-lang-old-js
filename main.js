let Token = require("./lang/Token.js");

let main = function() {
	let token1 = new Token("String", "Hello World!");
	let token2 = new Token("Number", 0.5);

	console.log(token1);
	console.log(token2);
	console.log(token1.string());
	console.log(token2.string());
}

main();