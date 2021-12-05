function run(code, initial, outputHandler) {
	code = code.split("\n").map((line) => line.split(" "));
	const reg = { 'a':0, 'b':0, 'c':0, 'd':0, ...(initial ?? {}) };

	const read = (value) => {
		const constant = parseInt(value);
		return isNaN(constant) ? reg[value] : constant;
	};
	const write = (target, value) => {
		if (reg[target] != null) {
			reg[target] = value;
		}
	};

	for (let pc=0; (pc<code.length) && (pc>=0); pc++) {
		//console.log(`${pc.toString(16).padStart(4, "0")}: ${code[pc].join(" ")}`);
		const [opcode,operand1,operand2] = code[pc];

		/* Optimizations */

		if (opcode === "inc") {
			if (
				(code[pc + 1][0] == "dec")
				&& (code[pc + 2][0] == "jnz")
				&& (code[pc + 2][2] == -2)
				&& (code[pc + 2][1] == code[pc + 1][1])
			) {
				if (
					(code[pc + 3][0] == "dec")
					&& (code[pc + 3][1] != code[pc][1])
					&& (code[pc + 3][1] != code[pc + 1][1])
					&& (code[pc + 4][0] == "jnz")
					&& (code[pc + 4][1] == code[pc + 3][1])
					&& (code[pc + 4][2] == -5)
				) {
					// inc x
					// dec y
					// jnz y -2
					// dec z
					// jnz z -5
					// ----------
					// x += y * z
					// y = 0
					// z = 0
					write(operand1, read(operand1) + (read(code[pc + 1][1]) * read(code[pc + 3][1])));
					write(code[pc + 1][1], 0);
					write(code[pc + 3][1], 0);
					pc += 4;
				}
				else {
					// inc x
					// dec y
					// jnz y -2
					// ----------
					// x += y
					// y = 0
					write(operand1, read(operand1) + read(code[pc + 1][1]));
					write(code[pc + 1][1], 0);
					pc += 2;
				}
				continue;
			}
		}

		switch (opcode) {
			case "cpy":
				write(operand2, read(operand1));
				break;
			case "inc":
				write(operand1, read(operand1) + 1);
				break;
			case "dec":
				write(operand1, read(operand1) - 1);
				break;
			case "jnz":
				if (read(operand1) !== 0) {
					pc += read(operand2) - 1;
				}
				break;
			case "tgl":
				const offset = read(operand1);
				const target = code[pc + offset];
				if (target == null) {
					break;
				}
				if (target.length === 2) {
					if (target[0] === "inc") {
						target[0] = "dec";
					}
					else {
						target[0] = "inc";
					}
				}
				else if (target.length === 3) {
					if (target[0] === "jnz") {
						target[0] = "cpy";
					}
					else {
						target[0] = "jnz";
					}
				}
				break;
			case "out":
				if (outputHandler != null) {
					const shouldContinue = outputHandler(read(operand1), {...reg, pc});
					if (!shouldContinue) {
						pc = code.length;
					}
				}
				break;
		}
	}
	
	return reg;
}

module.exports = { run };