module.exports = (input, part) => {
	let floor = 0;
	for (let i=0; i<input.length; i++) {
		const char = input[i];
		switch (char) {
			case "(": floor += 1; break;
			case ")": floor -= 1; break;
			default: return null;
		}
		if ((part === 2) && (floor === -1)) {
			return i+1;
		}
	}
	if (part === 1) {
		return floor;
	}
	return null;
};