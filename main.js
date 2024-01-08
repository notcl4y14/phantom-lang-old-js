let fs = require("fs");
let Lexer = require("./lang/Lexer.js");

let valid_args = ["--lexer"];
let param_args = [];

// TODO: Make this cleaner and cleaner to use. Also probably optimize :/
let parseArgs = function(str, ignore_valid = false) {
	let args = {};
	let error = { type: null, details: null };
	// let split = str.split(" ");

	for (let i = 0; i < str.length; i += 1) {
		let arg = str[i];
		let next = str[i + 1];

		if (!ignore_valid && args[0] == "-" && !valid_args.includes(arg)) {
			error.type = "invalid_arg";
			error.details = arg;
			break;

		} else if (param_args.includes(arg)) {
			i += 2;
			args[arg] = next;
			continue;
		}

		args[arg] = 1;
	}

	return { args, error };
}

let readFile = function(filename) {
	if (!fs.existsSync(filename)) {
		return "no_filedir";
	}

	return fs.readFileSync(filename, { mode: "r", encoding: "utf-8" } );
}

// let runfile = function(filename) {
	// let code = readfile(filename);

	// if (code == "no_filedir") {
		// console.log(`${filename} notfound!`);
		// return;
	// }

	// run(filename, code);
// }

let run = function(filename, code, flags) {
	let lexer = new Lexer(filename, code);
	let tokens = lexer.lexerize();

	if (flags["--lexer"])
	{
		tokens.forEach ((token) => console.log(token.string()));
	}
}

let main = function() {
	process.argv.splice(0, 2);

	// Parsing arguments
	let { args, error } = parseArgs(process.argv);

	if (error.type == "invalid_arg") {
		console.log(`Unknown argument '${error.details}'`);
		return;
	}

	// Looking for filename by checking if an argument
	// doesn't have '-' at the beginning
	let filename = "";
	for (let [ arg, _ ] of Object.entries(args)) if (arg[0] != "-") filename = arg;

	if (filename == "") {
		console.log("Please specify a filename!");
		return;
	}

	// Reading the file
	let code = readFile(filename);

	if (code == "no_filedir") {
		console.log(`${filename} not found!`);
		return;
	}

	// Running the code
	run(filename, code, args);
}

main();