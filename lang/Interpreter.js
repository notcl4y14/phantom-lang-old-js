let Node = require("./Node.js");

let Interpreter = class {
	constructor(filename) {
		this.filename = filename;
		// this.ast = ast;
	}

	// ---------------------------------------------------------------

	eval_Primary(node) {
		switch (node.getType()) {

			// Yup, the "Node.Type.TYPE"-s used to be strings like "Number" and "Program"

			// Values
			case Node.Type.Number: return { type: "number", value: node.getValue() };
			case Node.Type.String: return { type: "string", value: node.getValue() };
			case Node.Type.Literal:
				if (["true", "false"].includes(node.getValue()))
					return { type: "boolean", value: ( node.getValue() == "true" ) };
				return { type: node.getValue(), value: null };

			// Stmt
			// Expr
			case Node.Type.BinaryExpr: return this.eval_BinaryExpr(node);

			// Misc.
			case Node.Type.Program: return this.eval_Program(node);
		}
	}

	// ---------------------------------------------------------------

	// Values
	// Statements
	// Expressions
	eval_BinaryExpr(expr) {
		let left = this.eval_Primary(expr.left);
		let right = this.eval_Primary(expr.right);
		let operator = expr.operator;

		let type = "";
		let result = null;

		switch (operator) {
			case "+": result = left.value + right.value; break;
			case "-": result = left.value - right.value; break;
			case "*": result = left.value * right.value; break;
			case "/": result = left.value / right.value; break;
			case "%": result = left.value % right.value; break;
		}

		// switch (typeof(result)) {
			// case "number": type = "number";
			// case "string": type = "string";
		// }

		type = typeof(result);

		return { type, value: result };
	}

	// Misc.
	eval_Program(program) {
		let last = null;

		for (let i = 0; i < program.body.length; i += 1) {
			let node = program.body[i];
			last = this.eval_Primary(node);
		}

		return last;
	}
}

module.exports = Interpreter;