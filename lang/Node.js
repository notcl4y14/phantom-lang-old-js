let Node = class {
	constructor(type, obj = {}, pos = []) {
		this.type = type;
		this.pos = pos;
		for (let [key, value] of Object.entries(obj)) this[key] = value;
	}

	// ---------------------------------------------------------------
	
	static Type = {
		Program: 0,

		Number: 1,
		String: 2,
		Literal: 3,
		Identifier: 4,

		VarDeclaration: 5,

		BinaryExpr: 6,
	}

	// ---------------------------------------------------------------
	
	getType() { return this.type; }
	getValue() { return (this.value ? this.value : undefined); }
}

module.exports = Node;