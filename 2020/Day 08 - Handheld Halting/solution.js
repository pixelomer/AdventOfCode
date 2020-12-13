function run(instructions) {
	// This language has no conditions. If the program counter gets to the
	// same value more than once, this program contains an infinite loop.
	const state = { PC:0, A:0, didHalt:false };
	const set = new Set();
	while (state.PC < instructions.length) {
		if (set.has(state.PC)) {
			return state;
		}
		set.add(state.PC);
		const match = instructions[state.PC].match(/([a-z]{1,3}) ([+-][0-9]+)/);
		const instruction = match[1];
		const arg = parseInt(match[2]);
		switch (instruction) {
			case "acc": state.A += arg; break;
			case "nop": break;
			case "jmp": state.PC += arg - 1; break;
		}
		state.PC++;
	}
	state.didHalt = true;
	return state;
}

module.exports = (input, part) => {
	const instructions = input.split("\n");
	if (part === 1) {
		return run(instructions).A;
	}
	else {
		for (let i=0; i<instructions.length; i++) {
			// Brute force the correct program
			const newArray = instructions.slice(0, instructions.length);
			if (newArray[i].includes("nop")) {
				newArray[i] = newArray[i].replace("nop", "jmp");
			}
			else if (newArray[i].includes("jmp")) {
				newArray[i] = newArray[i].replace("jmp", "nop");
			}
			else continue;
			const result = run(newArray);
			if (result.didHalt) return result.A;
		}
	}
	return null;
};