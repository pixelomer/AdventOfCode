module.exports = (input, part, isTest) => {
	input = input.split("\n");
	if (part === 1) {
		let gamma = "";
		let epsilon = "";
		for (let j=0; j<input[0].length; j++) {
			let ones = 0;
			let zeroes = 0;
			for (let i=0; i<input.length; i++) {
				if (input[i][j] == 1) {
					ones++;
				}
				else zeroes++;
			}
			if (ones > zeroes) {
				gamma += "1";
				epsilon += "0";
			}
			else {
				gamma += "0";
				epsilon += "1";
			}
		}
		return BigInt("0b" + gamma) * BigInt("0b" + epsilon);
	}
	else {
		function find(input, compare) {
			input = [...input];
			for (let i=0; i<input[0].length; i++) {
				if (input.length <= 1) break;
				let ones=0, zeroes=0;
				for (let j=0; j<input.length; j++) {
					if (input[j][i] == 1) ones++;
					else zeroes++;
				}
				const filter = compare(ones, zeroes);
				input = input.filter((a) => a[i] == filter);
			}
			const result = BigInt("0b" + (input[0] ?? 0));
			return result;
		}
		const oxygen = find(input, (one, zero) => one >= zero ? 1 : 0);
		const carbon = find(input, (one, zero) => one < zero ? 1 : 0);
		return oxygen * carbon;
	}
};