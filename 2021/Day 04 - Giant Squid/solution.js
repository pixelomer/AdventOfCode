module.exports = (input, part, isTest) => {
	input = input.split("\n");
	const drawnNumbers = input[0].split(",").map((a) => +a);
	input.splice(0, 2);
	const boardNumbers = input.join(" ").match(/[0-9]+/g).map((a) => +a);
	const wonSet = new Set();

	for (let i=0; i<drawnNumbers.length; i++) {
		for (let j=0; j<boardNumbers.length; j++) {
			if (drawnNumbers[i] == boardNumbers[j]) {
				boardNumbers[j] = -1;
			}
		}
		for (let j=0; j<boardNumbers.length; j+=25) {
			let won = false;
			for (let y=0; y<5; y++) {
				let x;
				for (x=0; x<5; x++) {
					if (boardNumbers[j + y * 5 + x] > 0) break;
				}
				if (x == 5) won = true;
			}
			for (let x=0; x<5; x++) {
				let y;
				for (y=0; y<5; y++) {
					if (boardNumbers[j + y * 5 + x] > 0) break;
				}
				if (y == 5) won = true;
			}
			if (won == true) {
				if (part === 2) {
					wonSet.add(j);
					if ((boardNumbers.length / 25) !== wonSet.size) continue;
				}
				let sum = 0;
				for (let k=j; k<j + 25; k++) {
					if (boardNumbers[k] > 0) {
						sum += boardNumbers[k];
					}
				}
				return sum * drawnNumbers[i];
			}
		}
	}
};