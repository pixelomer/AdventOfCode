function solve(connections, wire) {
	function indexForName(name) {
		let index = 0;
		let multiplier = 1;
		for (let i = name.length - 1; i >= 0; i--) {
			index += multiplier * (name.charCodeAt(i) - "a".charCodeAt(0) + 1);
			multiplier *= 26;
		}
		console.assert(!(index >= 26 * 26));
		return index;
	}

	function inputForName(name) {
		if (name == null) {
			return { get: () => 0 };
		}
		if (name.match(/^[0-9]+$/)) {
			const value = parseInt(name);
			return { get: () => value };
		}
		const index = indexForName(name);
		return { get: () => (wires[index] != null) ? wires[index].get() : null };
	}

	const wires = new Array(26 * 26);
	
	const gates = {
		"AND": (a,b) => a & b,
		"OR": (a,b) => a | b,
		"LSHIFT": (a,b) => a << b,
		"RSHIFT": (a,b) => a >> b,
		"NOT": (a,b) => ~b,
		"FROM": (a,b) => b
	};
	while (connections.length) {
		const newConnections = new Array();
		connections.forEach((connection)=>{
			// not a good regex but it does the job
			const match = connection.match(/^((?:[a-z]{1,2} )|(?:[0-9]{1,5} ))?((?:AND )|(?:OR )|(?:[LR]SHIFT )|(?:NOT ))?((?:[a-z]{1,2})|(?:[0-9]{1,5})) -> ([a-z]{1,2})$/);

			let input1 = match[1] ?? null;
			const gate = (match[2] ?? "FROM").trim();
			const input2 = match[3];
			const output = match[4];

			if (input1 != null) input1 = input1.trim();

			const obj1 = inputForName(input1);
			const obj2 = inputForName(input2);

			// If one or both of the dependencies are missing,
			// ignore this connection for now.
			if ((obj1.get() == null) || (obj2.get() == null)) {
				newConnections.push(connection);
				return;
			}

			// If this signal can be calculated with the existing
			// data, calculate it and put it into the array.
			console.error(connection);
			const a = obj1.get();
			const b = obj2.get();

			wires[indexForName(output)] = {
				get: () => gates[gate](a, b)
			}
		});
		connections = newConnections;
	}
	return inputForName(wire).get();
};

module.exports = (input, part) => {
	let connections = input.split("\n");
	const firstResult = solve(connections, "a");
	if (part === 1) {
		return firstResult;
	}
	connections = connections.filter((item)=>{
		return !item.endsWith(" -> b");
	});
	connections.push(`${firstResult} -> b`);
	return solve(connections, "a");
}