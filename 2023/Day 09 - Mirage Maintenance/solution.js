/** @type { (input: string, part: number, isTest: boolean) => any } */
module.exports = (input, part, isTest) => {
	input = input.split("\n");
	let result = 0;
	for (const line of input) {
		const nums = line.split(" ").map((a)=>+a);
		const sequence = [nums];
		let last = 0;
		while (!sequence[last].every((a) => a === 0)) {
			const newSequence = [];
			for (let i=1; i<sequence[last].length; i++) {
				newSequence.push(sequence[last][i] - sequence[last][i-1]);
			}
			sequence.push(newSequence);
			last++;
		}
		if (part === 1) {
			sequence[last].push(0);
		}
		else {
			sequence[last].unshift(0);
		}
		for (let i=last; i>=1; i--) {
			const upper = sequence[i-1];
			const lower = sequence[i];
			if (part === 1) {
				upper.push(upper[upper.length-1] + lower[lower.length-1]);
			}
			else {
				upper.unshift(upper[0] - lower[0]);
			}
		}
		if (part === 1) {
			result += sequence[0][sequence[0].length-1];
		}
		else {
			result += sequence[0][0];
		}
	}
	return result;
};