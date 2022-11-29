module.exports = (input, part) => {
	input = input.split("\n").map(a =>
		a.match(/^([a-z]+) \(([0-9]+)\)(?: \-\> ((?:[a-z]+(?:, )?)+))?$/));
	const towers = new Map();
	for (const def of input) {
		towers.set(def[1], {
			name: def[1], val: +def[2], sub: def[3]?.split(", ")
		} );
	}
	function build(tower) {
		if (tower.sub == null) return;
		for (let i=0; i<tower.sub.length; i++) {
			const subName = tower.sub[i];
			if (typeof subName !== 'string') {
				continue;
			}
			tower.sub[i] = towers.get(subName);
			towers.delete(subName);
			tower.sub[i].parent = tower;
			build(tower.sub[i]);
		}
	}
	while (towers.size !== 1) {
		for (const tower of [...towers.values()]) {
			build(tower);
		}
	}
	const root = towers.values().next().value;

	if (part === 1) {
		return root.name;
	}

	function weight(tower) {
		if (tower.weight != null) return tower.weight;
		let result = tower.val;
		for (const subtower of tower.sub ?? []) {
			result += weight(subtower);
		}
		tower.weight = result;
		return result;
	}
	
	function unbalancedTower(tower) {
		const map = tower.sub
			.map((a) => weight(a))
		const uniqueWeight = map
			.filter((a, _, arr) => arr.indexOf(a) === arr.lastIndexOf(a))[0];
		const expected = map
			.filter((a, _, arr) => arr.indexOf(a) !== arr.lastIndexOf(a))[0];
		const unbalanced = tower.sub.find((a) => weight(a) === uniqueWeight);

		if (unbalanced == null) {
			return tower;
		}
		else {
			unbalanced.expected = expected;
			return unbalancedTower(unbalanced);
		}
	}

	function balance(tower) {
		return tower.expected - weight(tower.sub[0]) * tower.sub.length;
	}

	let unbalanced = unbalancedTower(root);
	return balance(unbalanced);
};