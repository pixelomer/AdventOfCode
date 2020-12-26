module.exports = (input, part, isTest) => {
	const program = input.split(",").map((val) => parseInt(val));

	function run(memory) {
		memory = [...memory]; // Create a copy
		let PC = 0;
		while (PC < memory.length) {
			//console.log(memory);
			const instruction = memory[PC++];
			let x, y;
			switch (instruction) {
				case 1:
					// *p2 = (*p0) + (*p1)
					x = memory[memory[PC++]];
					y = memory[memory[PC++]];
					memory[memory[PC++]] = x + y;
					break;
				case 2:
					// *p2 = (*p0) * (*p1)
					x = memory[memory[PC++]];
					y = memory[memory[PC++]];
					memory[memory[PC++]] = x * y;
					break;
				case 99:
					// halt
					PC = memory.length;
					break;
				default:
					// illegal instruction
					PC = memory.length;
					console.log(`Illegal instruction: ${instruction}`);
					break;
			}
		}
		return memory;
	}

	if (part === 1) {
		if (!isTest) {
			program[1] = 12;
			program[2] = 2;
		}
		return run(program)[0];
	}
	else {
		for (let noun = 0; noun <= 99; noun++) {
			for (let verb = 0; verb <= 99; verb++) {
				const newProgram = [...program];
				newProgram[1] = noun;
				newProgram[2] = verb;
				if (run(newProgram)[0] === 19690720) {
					return 100 * noun + verb;
				}
			}
		}
	}
};