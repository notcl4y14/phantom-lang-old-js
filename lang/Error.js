let Error = class {
	constructor(filename, details, pos) {
		this.filename = filename;
		this.details = details;
		this.pos = pos;
	}

	string() {
		let filename = this.filename;
		let details = this.details;

		let line = (this.pos[0].line == this.pos[1].line)
			? this.pos[0].line + 1
			: `${this.pos[0].line + 1}-${this.pos[1].line + 1}`;

		let column = (this.pos[0].column == this.pos[1].column)
			? this.pos[0].column + 1
			: `${this.pos[0].column + 1}-${this.pos[1].column + 1}`;

		return `${filename}: ${line} : ${column} : ${details}`;
	}
}

module.exports = Error;