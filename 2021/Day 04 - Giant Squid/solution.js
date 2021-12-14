module.exports = (input, part, isTest) => {
	input = input.split("\n");
	const drawnNumbers = input[0].split(",").map((a) => +a);
	input.splice(0, 2);
	const boardNumbers = input.join(" ").match(/[0-9]+/g).map((a) => +a);
	const wonSet = new Set();

	const BOARD_LENGTH = input[0].match(/[0-9]+/g).length;
	const BOARD_AREA = BOARD_LENGTH * BOARD_LENGTH;

	for (let i=0; i<drawnNumbers.length; i++) {
		for (let j=0; j<boardNumbers.length; j++) {
			if (drawnNumbers[i] == boardNumbers[j]) {
				boardNumbers[j] = -1;
			}
		}
		for (let j=0; j<boardNumbers.length; j+=BOARD_AREA) {
			let won = false;
			for (let y=0; y<BOARD_LENGTH; y++) {
				let x;
				for (x=0; x<BOARD_LENGTH; x++) {
					if (boardNumbers[j + y * BOARD_LENGTH + x] > 0) break;
				}
				if (x == BOARD_LENGTH) won = true;
			}
			for (let x=0; x<BOARD_LENGTH; x++) {
				let y;
				for (y=0; y<BOARD_LENGTH; y++) {
					if (boardNumbers[j + y * BOARD_LENGTH + x] > 0) break;
				}
				if (y == BOARD_LENGTH) won = true;
			}
			if (won == true) {
				if (part === 2) {
					wonSet.add(j);
					if ((boardNumbers.length / BOARD_AREA) !== wonSet.size) continue;
				}
				let sum = 0;
				for (let k=j; k<j + BOARD_AREA; k++) {
					if (boardNumbers[k] > 0) {
						sum += boardNumbers[k];
					}
				}
				return sum * drawnNumbers[i];
			}
		}
	}
};