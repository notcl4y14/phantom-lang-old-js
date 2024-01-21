let Node = require("./Node.js");

let Interpreter = class {
	constructor(filename) {
		this.filename = filename;
	}

	// ---------------------------------------------------------------

	Primary(node) {
		switch (node.getType()) {

			// Yup, the "Node.Type.TYPE"-s used to be strings like "Number" and "Program"

			// Values
			case Node.Type.Number: return { type: "number", value: node.getValue() };
			case Node.Type.String: return { type: "string", value: node.getValue() };
			case Node.Type.Literal: return this.Literal();

			// Stmt
			// Expr
			case Node.Type.BinaryExpr: return this.BinaryExpr(node);

			// Misc.
			case Node.Type.Program: return this.Program(node);
		}
	}

	// ---------------------------------------------------------------

	// Values
	Literal(expr) {
		if (["true", "false"].includes(expr.getValue()))
			return { type: "boolean", value: ( expr.getValue() == "true" ) };

		return { type: expr.getValue(), value: null };
	}
	// Statements
	// Expressions
	BinaryExpr(expr) {
		let left = this.Primary(expr.left);
		let right = this.Primary(expr.right);
		let operator = expr.operator;

		let type = "";
		let result = null;

		switch (operator) {
			case "+": result = left.value + right.value; break;
			case "-": result = left.value - right.value; break;
			case "*": result = left.value * right.value; break;
			case "/": result = left.value / right.value; break;
			case "%": result = left.value % right.value; break;
			case "^": result = left.value ** right.value; break;
			// case "^": result = left.value ^ right.value; break;
			// case "**": result = left.value ** right.value; break;
		}

		// switch (typeof(result)) {
			// case "number": type = "number";
			// case "string": type = "string";
		// }

		type = typeof(result);

		return { type, value: result };
	}

	// Misc.
	Program(program) {
		let last = null;

		for (let i = 0; i < program.body.length; i += 1) {
			let node = program.body[i];
			last = this.Primary(node);
		}

		return last;
	}
}

module.exports = Interpreter;