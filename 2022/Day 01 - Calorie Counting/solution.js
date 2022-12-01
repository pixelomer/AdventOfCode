module.exports = (input, part, isTest) => {
	input = input.split("\n\n");
	const elves = [];
	for (const elf of input) {
		elves.push(elf.split("\n").map((a) => +a)
			.reduce((a, b) => a+b, 0));
	}
	elves.sort((a,b) => b-a);
	if (part === 1) {
		return elves[0];
	}
	else {
		return elves[0] + elves[1] + elves[2];
	}
};