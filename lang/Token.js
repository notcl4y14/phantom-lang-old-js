let Tools_toObject = require("../utils/tools.js").Tools_toObject;

let Token = class {

    constructor (type, value) {
        this.type = type;
        this.value = value;
    }

    matches (type, value) {
        return this.type == type && this.value == value;
    }

    string () {
        // return `Token { type: ${this.type}, value: ${this.value} }`;
        return Tools_toObject("Token", { type: this.type, value: this.value });
    }
}

module.exports = Token;