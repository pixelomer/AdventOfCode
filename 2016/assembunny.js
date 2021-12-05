function run(code, initial) {
	code = code.split("\n");
	const reg = { 'a':0, 'b':0, 'c':0, 'd':0, ...(initial ?? {}) };

	const read = (value) => +value || reg[value];

	for (let pc=0; pc<code.length && pc>=0; pc++) {
		const [instruction,operand1,operand2] = code[pc].split(" ");
		switch (instruction) {
			case "cpy":
				reg[operand2] = read(operand1);
				break;
			case "inc":
				reg[operand1]++;
				break;
			case "dec":
				reg[operand1]--;
				break;
			case "jnz":
				if (read(operand1) !== 0) {
					pc += read(operand2) - 1;
				}
				break;
		}
	}
	
	return reg;
}

module.exports = { run };