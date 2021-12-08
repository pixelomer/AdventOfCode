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
		// Sorting signals alphabetically will make it easier to
		// figure out the number.
		input = input.split("\n")
			.map((a) => a.split(" | ")
				.map((a) => a.split(" ")
					.map((a) => a.split("")
						.sort((a,b) => a>b ? 1 : -1)
						.join(""))));

		for (const [allDigits, output] of input) {
			/**
			 * Looks for the first digit that meets the specified
			 * condition in the remaining digits and returns it.
			 * @param {number | () => boolean} cond Condition that
			 *   needs to be met. If a number is passed, the first
			 *   digit with the specified number of signals will
			 *   be returned.
			 * @returns {string} Signals.
			 */
			function find(cond) {
				if (typeof cond === 'number') {
					const length = cond;
					cond = (a) => a.length === length;
				}
				const index = allDigits.findIndex(cond);
				return allDigits.splice(index, 1)[0];
			}

			/**
			 * Returns signals from the first digit that are
			 * not in the second digit.
			 * @param {string} a First digit.
			 * @param {string} b Second digit.
			 * @returns {string} The remaining signals.
			 */
			function substract(a, b) {
				return a.split("").filter((c) => !b.includes(c)).join("");
			}

			/**
			 * Checks whether the first digit fully covers the
			 * second digit.
			 * @param {string} a First digit.
			 * @param {string} b Second digit.
			 * @returns {boolean} `true` if the first digit
			 *   fully covers the second digit, `false` otherwise.
			 */
			function includes(a, b) {
				return substract(b, a).length === 0;
			}

			// 1, 4, 7 and 8 each have a unique number of signals.
			const signals = {
				1: find(2),
				4: find(4),
				7: find(3),
				8: find(7),
			};

			// 9 is the only remaining digit that has a 4 in it.
			//      _
			// '_| '_|
			//   |  _'
			signals[9] = find((a) => includes(a, signals[4]));

			// The remaining digits with 6 signals are 6 and 0.
			// 0 has a 1 in it while 6 does not.
			//     _   _
			//  | | | |_
			//  ' '_' '_'
			signals[0] = find((a) => (a.length === 6) && includes(a, signals[1]));

			// 6 is now the only remaining digit with 6 signals.
			signals[6] = find(6);

			// 2, 3 and 5 remain. From these digits, 3 is the only
			// one that contains a 7.
			//  _   _
			//   |  _'
			//   '  _'
			signals[3] = find((a) => includes(a, signals[7]));

			// 2 and 5 remain. 2 has 2 signals in common with 4 while
			// 5 has 3 signals in common with 4.
			//      _   _
			// '_|  _' '_
			//   | '_   _'
			signals[2] = find((a) => substract(signals[4], a).length === 2);

			// Only 5 remains. It has 5 signals.
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