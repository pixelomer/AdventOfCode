module.exports = (input, part, isTest) => {
	input = input.split("\n");
	reg = { 'a':0, 'b':0 };
	if (part === 2) {
		reg['a'] = 1;
	}
	for (let pc=0; pc<input.length && pc>=0; pc++) {
		const line = input[pc];
		const [,instruction,operand1,operand2] = line.match(/^([^ ]+) ([^ ]+)(?:, ([^ ]+))?$/);
		switch (instruction) {
			case "hlf":
				reg[operand1] = Math.floor(reg[operand1] / 2);
				break;
			case "tpl":
				reg[operand1] *= 3;
				break;
			case "inc":
				reg[operand1] += 1;
				break;
			case "jmp":
				pc += +operand1 - 1;
				break;
			case "jie":
				if (reg[operand1] % 2 === 0) {
					pc += +operand2 - 1;
				}
				break;
			case "jio":
				if (reg[operand1] === 1) {
					pc += +operand2 - 1;
				}
				break;
		}
	}
	return isTest ? reg['a'] : reg['b'];
};