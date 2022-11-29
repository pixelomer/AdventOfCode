module.exports = (input, part) => {
	const banks = input.split(/[ \t]/g).filter((a) => a != "").map((a) => +a);
	function run(secondRun) {
		let step = 0;
		const states = new Set();
		const startState = banks.join(",");
		while (true) {
			const state = banks.join(",");
			if (secondRun && (step !== 0)) {
				if (state === startState) {
					break;
				}
			}
			else {
				if (states.has(state)) {
					break;
				}
				states.add(state);
			}
			const i = banks.indexOf([...banks].sort((a,b) => b-a)[0]);
			for (let j=1; banks[i] > 0; j++) {
				const k = (i + j) % banks.length;
				banks[i]--;
				banks[k]++;
			}
			step++;
		}
		return step;
	}
	let result = run(false);
	if (part === 1) return result;
	return run(true);
};