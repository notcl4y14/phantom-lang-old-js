let RuntimeValue = class {
	constructor(type, value) {
		this.type = type;
		this.value = value;
	}

	// ---------------------------------------------------------------

	// static Type = {
	// 	Dynamic: 0,
	// 	Number: 1,
	// 	String: 2,
	// 	Boolean: 3,
	// };
	// static StrType = {
	// 	"dynamic": 0,
	// 	"number": 1,
	// 	"string": 2,
	// 	"boolean": 3,
	// };

	// static getTypeFromStr(str) {
	// 	return RuntimeValue.Type[RuntimeValue.StrType[str]];
	// }
}

module.exports = RuntimeValue;