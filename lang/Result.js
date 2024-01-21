let Error = require("./Error.js");

let Result = class {
	constructor(filename) {
		this.filename = filename;
		this.value = null;
		this.error = null;
	}

	// ---------------------------------------------------------------

	register(res) {
		if (res instanceof Result) {
			if (res.error) this.error = res.error;
			return res.value;
		}
		
		return res;
	}

	success(value) { this.value = value; return this; }

	failure(details, position) {
		this.error = new Error(this.filename, details, position);
		return this;
	}
	// failure(error) { this.error = error; return this; }
}

module.exports = Result;