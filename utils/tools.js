let Tools_valueToString = function(value) {
	switch (typeof(value)) {
		case "string":
			return `"${value}"`;
		default:
			return `${value}`;
	}
}

let Tools_toObject = function(type, obj) {
	let entries = Object.entries(obj);
	let keys = Object.keys(obj);
	let str = type;

	if (type != "") str += " ";
	str += "{";

	for (let [ key, value ] of entries) {
		str += ` ${key}: ${Tools_valueToString(value)}`;
		if (key != keys[keys.length-1]) str += ",";
	}

	if (keys.length > 0) str += " ";
	str += "}";

	return str;
}

module.exports = { Tools_valueToString, Tools_toObject };