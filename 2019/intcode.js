const State = {
	RUNNING: 0,
	HALTED: 1,
	ILLEGAL_INSTRUCTION: 2
};

Object.keys(State).forEach((key) => {
	State[State[key]] = key;
});

function run(memory) {
	memory = [...memory];
	const machine = {
		PC: 0,
		state: State.RUNNING,
		memory: memory
	};
	while (machine.PC < memory.length) {
		//console.log(memory);
		const instruction = memory[machine.PC++];
		let x, y;
		switch (instruction) {
			case 1:
				// *p2 = (*p0) + (*p1)
				x = memory[memory[machine.PC++]];
				y = memory[memory[machine.PC++]];
				memory[memory[machine.PC++]] = x + y;
				break;
			case 2:
				// *p2 = (*p0) * (*p1)
				x = memory[memory[machine.PC++]];
				y = memory[memory[machine.PC++]];
				memory[memory[machine.PC++]] = x * y;
				break;
			case 99:
				// halt
				machine.state = State.HALTED;
				break;
			default:
				// illegal instruction
				machine.state = State.ILLEGAL_INSTRUCTION;
				break;
		}
		if (machine.state != State.RUNNING) {
			break;
		}
	}
	return machine;
}

module.exports = { run, State };