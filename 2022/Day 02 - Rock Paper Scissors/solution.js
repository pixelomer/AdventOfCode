module.exports = (input, part, isTest) => {
	input = input.split("\n").map((a) => a.split(" "));
	let res = 0;
	const points = { X: 1, Y: 2, Z: 3 };
	for (const line of input) {
		let a = line[0];
		let b = line[1];

		if (part === 2) {
			if (b === "X") {
				b = { A:"Z", B:"X", C:"Y" }[a];
			}
			else if (b === "Y") {
				b = { A:"X", B:"Y", C:"Z" }[a];
			}
			else {
				b = { A:"Y", B:"Z", C:"X" }[a];
			}
		}

		if ({A:"X",B:"Y",C:"Z"}[a] === b) {
			res += points[b] + 3;
		}
		else if (
			((a === "A") && (b === "Y")) ||
			((a === "B") && (b === "Z")) ||
			((a === "C") && (b === "X"))
		) {
			res += points[b] + 6;
		}
		else {
			res += points[b];
		}
	}
	return res;
};