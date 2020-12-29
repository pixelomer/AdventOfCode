const State = {
	RUNNING: 0,
	HALTED: 1,
	ILLEGAL_INSTRUCTION: 2,
	SUSPENDED: 3
};

const ParameterMode = {
	POSITION: 0,
	IMMEDIATE: 1,
	RELATIVE: 2
};

function constructEnum(obj) {
	Object.keys(obj).forEach((key) => {
		obj[obj[key]] = key;
	});
}

constructEnum(ParameterMode);
constructEnum(State);

function run(memory, input = []) {
	const machine = {
		PC: 0,
		state: State.SUSPENDED,
		memory: [...memory],
		input: [...input],
		output: [],
		relativeBase: 0
	};
	continueExecution(machine);
	return machine;
}

function continueExecution(machine) {
	if (machine.state !== State.SUSPENDED) {
		return machine;
	}

	machine.state = State.RUNNING;
	
	const memory = machine.memory;
	const input = machine.input;
	const output = machine.output;

	function illegalInstruction() {
		throw new Error();
	}

	function read(address, mode = ParameterMode.POSITION) {
		switch (mode) {
			case ParameterMode.IMMEDIATE:
				return address;
			case ParameterMode.RELATIVE:
				address += machine.relativeBase;
			case ParameterMode.POSITION:
				if (address < 0) {
					illegalInstruction();
				}
				return memory[address] ?? 0;
			default:
				illegalInstruction();
		}
	}

	function write(address, value, mode) {
		switch (mode) {
			case ParameterMode.IMMEDIATE:
			case ParameterMode.POSITION:
				break;
			case ParameterMode.RELATIVE:
				address += machine.relativeBase;
				break;
		}
		if (address < 0) {
			illegalInstruction();
		}
		for (let i=memory.length; i<=address; i++) {
			memory.push(0);
		}
		memory[address] = value;
	}

	function getInput() {
		return input.shift();
	}

	while (machine.PC < memory.length) {
		const initialPC = machine.PC;
		try {
			let instruction = read(machine.PC++);
			const mode = [
				ParameterMode.POSITION,
				ParameterMode.POSITION,
				ParameterMode.POSITION
			];
			for (let i=0, val=Math.floor(instruction / 100); (i < 3) && (val != 0); val = Math.floor(val / 10), i++) {
				mode[i] = val % 10;
			}
			let x, y;
			instruction %= 100;
			switch (instruction) {
				case 1:
					// *p2 = (*)p0 + (*)p1
					x = read(read(machine.PC++), mode[0]);
					y = read(read(machine.PC++), mode[1]);
					write(read(machine.PC++), (x + y), mode[2]);
					break;
				case 2:
					// *p2 = (*)p0 * (*)p1
					x = read(read(machine.PC++), mode[0]);
					y = read(read(machine.PC++), mode[1]);
					write(read(machine.PC++), (x * y), mode[2]);
					break;
				case 99:
					// halt
					machine.state = State.HALTED;
					break;
				case 3:
					// *p0 = get_input()
					x = getInput();
					if (x == null) {
						machine.PC--;
						machine.state = State.SUSPENDED;
						break;
					}
					write(read(machine.PC++), x, mode[0]);
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
					write(read(machine.PC++), ((x < y) ? 1 : 0), mode[2]);
					break;
				case 8:
					// *p2 = (*)p0 == (*)p1
					x = read(read(machine.PC++), mode[0]);
					y = read(read(machine.PC++), mode[1]);
					write(read(machine.PC++), ((x == y) ? 1 : 0), mode[2]);
					break;
				case 9:
					// relative_base += (*)p0
					machine.relativeBase += read(read(machine.PC++), mode[0]);
					break;
				default:
					throw new Error();
			}
		}
		catch {
			// Rollback
			machine.state = State.ILLEGAL_INSTRUCTION;
			machine.PC = initialPC;
			console.log("[WARNING] The Intcode program crashed.");
		}
		if (machine.state != State.RUNNING) {
			break;
		}
	}
	return machine;
}

module.exports = { run, continueExecution, State };