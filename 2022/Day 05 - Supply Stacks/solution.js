module.exports = (input, part, isTest) => {
	input = input.split("\n\n");

	let maxSpot = 0;

	let crateLines = input[0].split("\n");
	crateLines.splice(crateLines.length-1, 1);
	const crates = new Map();
	for (const line of crateLines.reverse()) {
		let j=1;
		for (let i=0; i<line.length; i+=4, j++) {
			const item = line.slice(i+1, i+2);
			if (item !== " ") {
				crates.set(j, crates.get(j) ?? []);
				crates.get(j).push(item);
			}
		}
		maxSpot = Math.max(maxSpot, j-1);
	}

	for (const instr of input[1].split("\n")) {
		let [_, count, from, to] = instr.match(/move (\d+) from (\d+) to (\d+)/);
		from = crates.get(+from);
		to = crates.get(+to);
		let moved = from.splice(from.length-(+count), +count);
		if (part === 1) {
			moved = moved.reverse();
		}
		to.push(...moved);
	}
	
	let result = "";
	for (let i=1; i<=maxSpot; i++) {
		result += crates.get(i)[crates.get(i).length-1];
	}
	return result;
};