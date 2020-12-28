const State = {
	RUNNING: 0,
	HALTED: 1,
	ILLEGAL_INSTRUCTION: 2
};

const ParameterMode = {
	POSITION: 0,
	IMMEDIATE: 1
}

function constructEnum(obj) {
	Object.keys(obj).forEach((key) => {
		obj[obj[key]] = key;
	});
}

constructEnum(ParameterMode);
constructEnum(State);

function run(memory, input = []) {
	memory = [...memory];
	input = [...input];
	const output = [];
	const machine = {
		PC: 0,
		state: State.RUNNING,
		memory: memory,
		unusedInput: input,
		output: output
	};

	function illegalInstruction() {
		throw new Error();
	}

	function read(address, mode = ParameterMode.POSITION) {
		switch (mode) {
			case ParameterMode.IMMEDIATE:
				return address;
			case ParameterMode.POSITION:
				if (address > memory.length) {
					illegalInstruction();
				}
				return memory[address];
			default:
				illegalInstruction();
		}
	}

	function write(address, value) {
		if (address > memory.length) {
			illegalInstruction();
		}
		memory[address] = value;
	}

	function getInput() {
		if (input.length == 0) {
			illegalInstruction();
		}
		return input.shift();
	}

	while (machine.PC < memory.length) {
		//console.log(memory);
		const initialPC = machine.PC;
		try {
			let instruction = read(machine.PC++);
			const mode = [
				ParameterMode.POSITION,
				ParameterMode.POSITION,
				ParameterMode.POSITION
			];
			for (let i=0, val=Math.floor(instruction / 100); val != 0; val = Math.floor(val / 10), i++) {
				mode[i] = val % 10;
			}
			let x, y;
			instruction %= 100;
			switch (instruction) {
				case 1:
					// *p2 = (*)p0 + (*)p1
					x = read(read(machine.PC++), mode[0]);
					y = read(read(machine.PC++), mode[1]);
					write(read(machine.PC++), x + y);
					break;
				case 2:
					// *p2 = (*)p0 * (*)p1
					x = read(read(machine.PC++), mode[0]);
					y = read(read(machine.PC++), mode[1]);
					write(read(machine.PC++), x * y);
					break;
				case 99:
					// halt
					machine.state = State.HALTED;
					break;
				case 3:
					// *p0 = get_input()
					write(read(machine.PC++), getInput());
					break;
				case 4:
					// output >>= 1
					// output[0] = (*)p0
					output.unshift(read(read(machine.PC++), mode[0]));
					break;
				case 5:
					// if ((*)p0) PC = (*)p1
					x = read(read(machine.PC++), mode[0]);
					y = read(read(machine.PC++), mode[1]);
					if (x) machine.PC = y;
					break;
				case 6:
					// if (!(*)p0) PC = (*)p1
					x = read(read(machine.PC++), mode[0]);
					y = read(read(machine.PC++), mode[1]);
					if (!x) machine.PC = y;
					break;
				case 7:
					// *p2 = (*)p0 < (*)p1
					x = read(read(machine.PC++), mode[0]);
					y = read(read(machine.PC++), mode[1]);
					write(read(machine.PC++), (x < y) ? 1 : 0);
					break;
				case 8:
					// *p2 = (*)p0 == (*)p1
					x = read(read(machine.PC++), mode[0]);
					y = read(read(machine.PC++), mode[1]);
					write(read(machine.PC++), (x == y) ? 1 : 0);
					break;
				default:
					throw new Error();
			}
		}
		catch {
			// Rollback
			machine.state = State.ILLEGAL_INSTRUCTION;
			machine.PC = initialPC;
		}
		if (machine.state != State.RUNNING) {
			break;
		}
	}
	return machine;
}

module.exports = { run, State };