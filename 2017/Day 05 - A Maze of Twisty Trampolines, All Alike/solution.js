module.exports = (input, part) => {
	const instr = input.split("\n").map((a) => +a);
	let i = 0;
	let steps = 0;
	while (i < instr.length) {
		const val = instr[i];
		if ((val >= 3) && (part === 2)) {
			instr[i]--;
		}
		else {
			instr[i]++;
		}
		i += val;
		steps++;
	}
	return steps;
};