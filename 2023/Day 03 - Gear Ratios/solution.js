/** @type { (input: string, part: number, isTest: boolean) => any } */
module.exports = (input, part, isTest) => {
	const lineLength = input.split("\n")[0].length + 1; // includes \n
	let match;
	let offset = 0;
	let remainingInput = input;
	let result = 0;
	let gears = new Map();
	main: while ((match = remainingInput.match(/([0-9]+)/)) != null) {
		const x = (offset + match.index) % lineLength;
		const y = Math.floor((offset + match.index) / lineLength);
		remainingInput = remainingInput.slice(match.index + match[1].length);
		offset += match.index + match[1].length;
		const number = +match[1];
		for (let tx = x-1; tx <= x+match[1].length; tx++) {
			for (let ty = y-1; ty <= y+1; ty++) {
				const char = input[ty * lineLength + tx];
				if (char == null || "0123456789.\n".includes(char)) continue;
				const key = `${tx},${ty}`;
				gears.set(key, [...(gears.get(key) || []), number]);
				result += number;
				continue main;
			}
		}
	}
	if (part === 2) {
		result = 0;
		for (const numbers of gears.values()) {
			if (numbers.length === 2) {
				result += numbers[0] * numbers[1];
			}
		}
	}
	return result;
};