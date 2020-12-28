const intcode = require("../intcode");

module.exports = (input, part) => {
	const program = input.split(",").map((val) => parseInt(val));
	const machine = intcode.run(program, [(part === 2) ? 5 : 1]);
	if ((machine.unusedInput.length != 0) || (machine.output.slice(1).some((val) => val))) {
		console.log("[-] Machine tests failed");
		return null;
	}
	return machine.output[0];
};