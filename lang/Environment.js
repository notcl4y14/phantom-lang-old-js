let Environment = class {
	constructor(parentEnv = null) {
		this.parent = parentEnv;
		this.variables = {};
	}

	declare(name, type, value) {
		if (this.variables[name])
			return ;

		this.variables[name] = { type, value };
		return this.lookup(name);
	}

	set(name, value) {
		if (!this.variables[name])
			return ;

		this.variables[name].value = value;
		return this.lookup(name);
	}

	lookup(name) {
		if (!this.variables[name])
			return ;

		return this.variables[name];
	}
}

module.exports = Environment;