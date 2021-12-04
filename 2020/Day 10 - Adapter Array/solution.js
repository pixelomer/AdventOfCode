module.exports = (input, part) => {
	let split = input.split("\n");
	if (part === 1) {
		let ones = 0;
		let threes = 0;
		let previous = 0;
		while (split.length) {
			let value = null;
			let index = null;
			for (let i=0; i<split.length; i++) {
				const num = parseInt(split[i]);
				if (((num - previous) < 0) || ((num - previous) > 3)) {
					continue;
				}
				if ((value == null) || (num < value)) {
					value = num;
					index = i;
				}
			}
			if (value == null) return null;
			if ((value - previous) === 3) threes++;
			else if ((value - previous) === 1) ones++;
			previous = value;
			split = split.filter((val,_index) => (index !== _index));
		}
		return ones * (threes + 1);
	}
	else if (part === 2) {
		let highest = 0;
		for (let i=0; i<split.length; i++) {
			split[i] = parseInt(split[i]);
			if (split[i] > highest) {
				highest = split[i];
			}
		}
		split.push(highest + 3);

		const cache = {};

		function findCombinations(currentEnd, availableAdapters, shouldLog = true) {
			if (currentEnd == highest) {
				return 1;
			}
			let combinationCount = 0;
			for (let i=1; i<=3; i++) {
				if (availableAdapters.includes(currentEnd + i)) {
					const remaining = availableAdapters.filter((value) => (value > (currentEnd + i)));
					if (cache[currentEnd + i] == null) {
						cache[currentEnd + i] = findCombinations(currentEnd + i, remaining, false);
					}
					combinationCount += cache[currentEnd + i];
				}
			}
			return combinationCount;
		}

		return findCombinations(0, split);
	}
	return null;
};