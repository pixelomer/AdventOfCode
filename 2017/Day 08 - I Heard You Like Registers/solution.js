module.exports = (input, part) => {
	const instructions = input.split("\n");
	const registers = new Map();
	
	function read(name) {
		const num = parseInt(name);
		if (!isNaN(num)) {
			return num;
		}
		return registers.get(name) ?? 0;
	}

	function write(name, value) {
		registers.set(name, value);
	}

	let highest = Number.MIN_SAFE_INTEGER;
	for (const instruction of instructions) {
		const [, output, opcode, value, regA, condition, regB] = instruction.match(/([a-z]+) (inc|dec) ([a-z]+|[0-9\-]+) if ([a-z]+|[0-9\-]+) ([<>=!]{1,2}) ([a-z]+|[0-9\-]+)/);
		const a = read(regA);
		const b = read(regB);
		const conditionMet = eval(`${a}${condition}${b}`);
		if (conditionMet) {
			const newValue = read(output) + ((opcode === "dec") ? -1 : 1) * value;
			write(output, newValue);
			if (newValue > highest) {
				highest = newValue;
			}
		}
	}

	if (part === 2) {
		return highest;
	}
	else {
		let result = Number.MIN_SAFE_INTEGER;
		for (const val of registers.values()) {
			result = (val > result) ? val : result;
		}
		return result;
	}
};