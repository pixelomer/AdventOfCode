const intcode = require("../intcode");

module.exports = (input, part, isTest) => {
	const program = input.split(",").map((val) => parseInt(val));
	if (part === 1) {
		if (!isTest) {
			program[1] = 12;
			program[2] = 2;
		}
		return intcode.run(program).memory[0];
	}
	else {
		for (let noun = 0; noun <= 99; noun++) {
			for (let verb = 0; verb <= 99; verb++) {
				const newProgram = [...program];
				newProgram[1] = noun;
				newProgram[2] = verb;
				if (intcode.run(newProgram).memory[0] === 19690720) {
					return 100 * noun + verb;
				}
			}
		}
	}
};