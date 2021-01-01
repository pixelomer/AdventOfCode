module.exports = (input, part) => {
	input = input.split("\n").map((val) => parseInt(val));
	if (part === 1) {
		return input.reduce(((acc, val) => acc + val), 0);
	}
	else {
		const set = new Set([0]);
		let frequency = 0;
		while (true) {
			if (input.some((val) => {
				frequency += val;
				if (set.has(frequency)) return true;
				set.add(frequency);
			})) {
				return frequency;
			}
		}
	}
};