module.exports = (input, part, isTest) => {
	let result = 0;
	if (part === 1) {
		input = input.split("\n").map((a) => a.split(" | ")[1]);
		for (const output of input) {
			for (const a of output.split(" ")) {
				if ([2,3,4,7].includes(a.length)) {
					result++;
				}
			}
		}
	}
	else {
		input = input.split("\n")
			.map((a) => a.split(" | ")
				.map((a) => a.split(" ")
					.map((a) => a.split("")
						.sort((a,b) => a>b ? 1 : -1)
						.join("")
					)
				)
			);
		for (const [allDigits, output] of input) {
			function find(cond) {
				if (typeof cond === 'number') {
					const length = cond;
					cond = (a) => a.length === length;
				}
				const index = allDigits.findIndex(cond);
				if (index === -1) {
					console.log("Couldn't find for condition", cond.toString());
					throw new Error();
				}
				return allDigits.splice(index, 1)[0];
			}
			function substract(a, b) {
				return a.split("").filter((c) => !b.includes(c));
			}
			function includes(a, b) {
				return substract(b, a).length === 0;
			}

			const signals = {
				1: find(2),
				4: find(4),
				7: find(3),
				8: find(7),
			};
			signals[9] = find((a) => includes(a, signals[4]));
			signals[0] = find((a) => (a.length === 6) && includes(a, signals[1]));
			signals[6] = find(6);
			signals[3] = find((a) => includes(a, signals[7]));
			signals[2] = find((a) => substract(signals[4], a).length === 2);
			signals[5] = find(5);
			const digits = {};
			for (const digit in signals) {
				digits[signals[digit]] = digit;
			}
			result += +output.map((signal) => digits[signal]).join("");
		}
	}
	return result;
};