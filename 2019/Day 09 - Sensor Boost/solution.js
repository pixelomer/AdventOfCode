const intcode = require("../intcode");

module.exports = (input, part) => {
	const program = input.split(",").map((val) => parseInt(val));
	const machine = intcode.run(program, [(part === 1) ? 1 : 2]);
	return machine.output[0];
};