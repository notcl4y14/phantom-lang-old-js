let Node = class {
	constructor(type, obj = {}) {
		this.type = type;
		for (let [key, value] of Object.entries(obj)) this[key] = value;
	}

	// ---------------------------------------------------------------
	
	static Type = {
		Program: 0,

		Number: 1,
		String: 2,
		Literal: 3,

		BinaryExpr: 4,
	}

	// ---------------------------------------------------------------
	
	getType() { return this.type; }
	getValue() { return (this.value ? this.value : undefined); }
}

module.exports = Node;