const assembunny = require('../assembunny');

module.exports = (input, part) => {
	if (part === 1) {
		return assembunny.run(input).a;
	}
	else {
		return assembunny.run(input, { c: 1 }).a;
	}
};