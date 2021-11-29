module.exports = (input, part) => {
	const blueprint = input.split("\n\n");
	const metadata = blueprint[0].split("\n");
	const initialState = metadata[0].match(/Begin in state ([A-Z]+)\./)[1];
	const stepCount = +metadata[1].match(/Perform a diagnostic checksum after ([0-9]+) steps\./)[1];
	const states = {};
	for (let i=1; i<blueprint.length; i++) {
		const stateDefinition = blueprint[i].split("\n");
		const state = stateDefinition[0].match(/In state ([A-Z]+):/)[1];
		states[state] = {};
		for (let j=1; j<stateDefinition.length; j+=4) {
			const condition = +stateDefinition[j].match(/If the current value is ([0-9])/)[1];
			const output = +stateDefinition[j+1].match(/Write the value ([10])\./)[1];
			const movement = stateDefinition[j+2].match(/Move one slot to the (right|left)\./)[1];
			const nextState = stateDefinition[j+3].match(/Continue with state ([A-Z]+)\./)[1];
			states[state][condition] = {
				data: output,
				offset: movement === "right" ? 1 : -1,
				nextState: nextState
			};
		}
	}
	const memory = new Set();
	let pointer = 0;
	let state = initialState;
	const read = (i) => +memory.has(i);
	const write = (i, val) => val ? memory.add(i) : memory.delete(i);
	for (let i=0; i<stepCount; i++) {
		const stateData = states[state][read(pointer)];
		write(pointer, stateData.data);
		pointer += stateData.offset;
		state = stateData.nextState;
	}
	return memory.size;
};