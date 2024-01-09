let fs = require("fs");
let util = require("util");

let valid_args = ["--lexer", "--parser", "--last-eval"];
let param_args = [];

// ---------------------------------------------------------------

// TODO: Make this cleaner and cleaner to use. Also probably optimize :/
let parseArgs = function(str, ignore_valid = false) {
	let args = {};
	let error = { type: null, details: null };

	// Checking if the args list is not empty
	if (str.length == 0) return { args, error };

	// Iterating
	for (let i = 0; i < str.length; i += 1) {
		// Getting the argument
		let arg = str[i];
		let next = str[i + 1];

		// Checking if the argument is valid
		if (!ignore_valid && args[0] == "-" && !valid_args.includes(arg)) {
			error.type = "invalid_arg";
			error.details = arg;
			break;

		// Checking if the argument requires a parameter
		} else if (param_args.includes(arg)) {
			i += 2;
			args[arg] = next;
			continue;
		}

		// Just an argument with no parameter o-o
		args[arg] = 1;
	}

	return { args, error };
}

let getFilename = function(args) {
	// Looking for filename by checking if an argument
	// doesn't have '-' at the beginning
	let filename = "";
	for (let [ arg, _ ] of Object.entries(args)) if (arg[0] != "-") filename = arg;

	return filename;
}

let readFile = function(filename) {
	if (!fs.existsSync(filename)) {
		return "no_filedir";
	}

	return fs.readFileSync(filename, { mode: "r", encoding: "utf-8" } );
}

let runFile = function(filename, flags) {
	let code = readFile(filename);
	if (code == "no_filedir") return "no_filedir";

	run(filename, code, flags);
}

let run = function(filename, code, flags) {
	let Lexer = require("./lang/Lexer.js");
	let Parser = require("./lang/Parser.js");
	let Interpreter = require("./lang/Interpreter.js");

	// Lexer
	let lexer = new Lexer(filename, code);
	let tokens = lexer.lexerize();

	if (flags["--lexer"]) {
		tokens.forEach ((token) => console.log(token.string()));
	}

	// Parser
	let parser = new Parser(filename, tokens);
	let ast = parser.parse();

	if (flags["--parser"]) {
		console.log( util.inspect(ast, { colors: true, hidden: false, depth: null }) );
	}

	// Interpreter
	let interpreter = new Interpreter(filename);
	let lastEval = interpreter.eval_Primary(ast);

	if (flags["--last-eval"]) {
		console.log(lastEval);
	}
}

// ---------------------------------------------------------------

let main = function() {
	process.argv.splice(0, 2);

	// Parsing arguments
	let { args, error } = parseArgs(process.argv);
	if (error.type == "invalid_arg") return console.log(`Unknown argument '${error.details}'`);

	// Getting filename
	let filename = getFilename(args);
	if (filename == "") return console.log("Please specify a filename!");

	// Running the file
	let result = runFile(filename, args);
	if (result == "no_filedir") console.log(`${filename} notfound!`);

	// Reading the file
	// let code = readFile(filename);
	// if (code == "no_filedir") return console.log(`${filename} not found!`);

	// Running the code
	// run(filename, code, args);
}

main();