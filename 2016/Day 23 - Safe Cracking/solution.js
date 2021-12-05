const assembunny = require('../assembunny');

module.exports = (input, part, isTest) => {
	const initial = {};
	if (!isTest) {
		initial["a"] = (part === 2) ? 12 : 7;
	}
	return assembunny.run(input, initial).a;
};