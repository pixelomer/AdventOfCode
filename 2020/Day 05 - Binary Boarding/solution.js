// The encoding with B, R, L and F is just a different
// way to represent binary.
function parseBinary(str) {
	let x = 0;
	for (var i=0; i<str.length; i++) {
		switch (str[i]) {
			case "B":
			case "R":
				x |= 1;
				break;
		}
		x <<= 1;
	}
	return x >> 1;
}

function getID(row, column) {
	return row * 8 + column;
}

module.exports = (input, part) => {
	const array = input.split("\n");
	let highest = 0;
	let seats = null;
	if (part === 2) {
		seats = new Array();
		for (var i=0; i<128; i++) {
			seats.push(new Array(8));
			for (var j=0; j<8; j++) {
				seats[i][j] = false;
			}
		}
	}
	array.forEach((seat)=>{
		const row = parseBinary(seat.substr(0, 7));
		const column = parseBinary(seat.substr(7, 3));
		const id = getID(row, column);
		highest = Math.max(id, highest);
		if (part === 2) {
			seats[row][column] = true;
		}
	});
	if (part === 2) {
		for (let row=0; row<seats.length; row++) {
			let fullSeatCount = 0;
			let lastEmptyColumn = 0;
			for (let column=0; column<seats[row].length; column++) {
				if (seats[row][column]) {
					fullSeatCount++;
				}
				else {
					lastEmptyColumn = column;
				}
			}
			if (fullSeatCount === 7) {
				return getID(row, lastEmptyColumn);
			}
		}
	}
	else if (part === 1) {
		return highest;
	}
	return null;
};