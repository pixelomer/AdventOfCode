const assembunny = require('../assembunny');

module.exports = (input, part) => {
	if (part === 2) {
		console.log("There is no part 2.");
		return;
	}
	let value = 0;
	while (true) {
		let previous = null;
		let iterationCount = 0;
		assembunny.run(input, { a: value }, (output) => {
			if ((output > 1) || (output < 0)) return false;
			if ((previous != null) && (output == previous)) return false;
			previous = output;
			iterationCount++;
			if (iterationCount === 100) {
				// If the signal was correct 100 times then the value
				// is probably correct ¯\_(ツ)_/¯
				return false;
			}
			return true;
		});
		if (iterationCount === 100) {
			return value;
		}
		value++;
	}
};