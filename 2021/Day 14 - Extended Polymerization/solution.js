module.exports = (input, part, isTest) => {
	input = input.split("\n\n");
	let polymer = input[0];
	const rules = {};

	for (const rule of input[1].split("\n")) {
		const [,from,to] = rule.match(/([A-Z]+) \-\> ([A-Z]+)/);
		rules[from] = to;
	}
	const cache = new Map();
	
	function find(polymer, stepCount) {
		function step(pair, depth = 1) {
			const cacheKey = `${pair},${depth}`;
			if (cache.has(cacheKey)) {
				return cache.get(cacheKey);
			}
			const substates = [];
			if (depth > stepCount) {
				substates.push({ [pair[0]]: 1 }, { [pair[1]]: 1 });
			}
			else {
				let result = "";
				for (let i=0; i<pair.length-1; i++) {
					result += pair[i] + rules[pair.slice(i, i+2)];
				}
				result += pair[pair.length-1];
				for (let i=0; i<result.length-1; i++) {
					substates.push(step(result.slice(i, i+2), depth+1));
				}
			}
			const state = {};
			for (const substate of substates) {
				for (const key in substate) {
					state[key] = (state[key] ?? 0) + substate[key];
				}
			}
			cache.set(cacheKey, state);
			return state;
		}
		const finalState = step(polymer);

		finalState[polymer[0]]++;
		finalState[polymer[polymer.length-1]]++;
		for (const key in finalState) {
			finalState[key] = finalState[key] / 2;
		}
		return finalState;
	}

	const stepCount = (part === 1) ? 10 : 40;
	const state = find(polymer, stepCount);
	let min = Number.MAX_SAFE_INTEGER;
	let max = 0;
	for (const key in state) {
		max = Math.max(state[key], max);
		min = Math.min(state[key], min);
	}
	return max - min;
};