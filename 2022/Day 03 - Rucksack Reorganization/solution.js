module.exports = (input, part, isTest) => {
	/** @param {string} a */
	function priority(a) {
		const kc = a.charCodeAt(0);
		if ((a >= "a") && (a <= "z")) {
			return kc - "a".charCodeAt(0) + 1;
		}
		else {
			return kc - "A".charCodeAt(0) + 1 + 26;
		}
	}

	function find(...list) {
		const others = list.slice(1);
		for (let i=0; i<list[0].length; i++) {
			if (others.every((a) => a.includes(list[0][i]))) {
				return list[0][i];
			}
		}
	}

	const items = [];
	input = input.split("\n");

	if (part === 2) {
		for (let i=0; i<input.length; i+=3) {
			const item = find(input[i], input[i+1], input[i+2]);
			items.push(item);
		}
	}
	else {
		for (const line of input) {
			const item = find(line.slice(line.length / 2), line.slice(0, line.length / 2));
			items.push(item);
		}
	}

	return items.reduce((a, b) => a + priority(b), 0);
};