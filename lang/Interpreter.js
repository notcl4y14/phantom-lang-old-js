let Result = require("./Result.js");
let Node = require("./Node.js");
let RuntimeValue = require("./RuntimeValue.js");

let Interpreter = class {
	constructor(filename) {
		this.filename = filename;
	}

	// ---------------------------------------------------------------

	Primary(node, env) {
		switch (node.getType()) {

			// Yup, the "Node.Type.TYPE"-s used to be strings like "Number" and "Program"

			// Values
			case Node.Type.Number:
				return new Node("number", node.getValue());
			case Node.Type.String:
				return new Node("string", node.getValue());
			case Node.Type.Literal:
				return this.Literal(node);
			case Node.Type.Identifier:
				return env.lookup(node.value);

				// Stmt
			case Node.Type.VarDeclaration:
				return this.VarDeclaration(node, env);

				// Expr
			case Node.Type.BinaryExpr:
				return this.BinaryExpr(node, env);

				// Misc.
			case Node.Type.Program:
				return this.Program(node, env);
		}
	}

	// ---------------------------------------------------------------

	// Values
	Literal(expr) {
		if (["true", "false"].includes(expr.value)) {
			return res.success(new RuntimeValue(
				"boolean",
				(expr.value == "true")
			));
		}

		return res.success(new RuntimeValue(expr.value, null));
	}

	// Statements
	VarDeclaration(expr, env) {
		let res = new Result(this.filename);

		// let name = res.register(this.Primary(expr.name, env));
		// if (res.error) return res;
		let name = expr.name;
		let type = expr.runtime_type;
		let value = res.register(this.Primary(expr.value, env));
		if (res.error) return res;

		let variable = env.declare(name.value, type, value);
		if (!variable) return res.failure(`Cannot redeclare '${name}'`, expr.pos);

		return res.success(variable.value);
	}

	// Expressions
	BinaryExpr(expr, env) {
		let res = new Result(this.filename);

		let left = res.register(this.Primary(expr.left, env));
		if (res.error) return res;
		let right = res.register(this.Primary(expr.right, env));
		if (res.error) return res;
		let operator = expr.operator;

		let type = "";
		let value = null;

		switch (operator) {
			case "+":
				value = left.value + right.value;
				break;
			case "-":
				value = left.value - right.value;
				break;
			case "*":
				value = left.value * right.value;
				break;
			case "/":
				value = left.value / right.value;
				break;
			case "%":
				value = left.value % right.value;
				break;
			case "^":
				value = left.value ** right.value;
				break;
		}

		// switch (typeof(value)) {
		// case "number": type = "number";
		// case "string": type = "string";
		// }

		type = typeof(value);

		return res.success(new RuntimeValue(type, value));
	}

	// Misc.
	Program(program, env) {
		let res = new Result(this.filename);
		let last = null;

		for (let i = 0; i < program.body.length; i += 1) {
			let node = program.body[i];
			last = res.register(this.Primary(node, env));
			if (res.error) return res;
		}

		return res.success(last);
	}
}

module.exports = Interpreter;