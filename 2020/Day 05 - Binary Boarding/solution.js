// Personal stats:
// [Part 1] 00:07:11, #611
// [Part 2] 00:18:41, #1942

// The encoding with B, R, L and F is just a different
// way to represent binary.
function parseBinary(str) {
	// SPEED IMPROVEMENT: Although it is cleaner to parse 
	//   the encoding this way, it might've been faster to
	//   implement a parser like this:
	//
	//   return parseInt(str.replace(/[BR]/g, "1").replace(/[LF]/g, "0"), 2)
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
	// BLUNDER: At first, I calculated the ID with (row * column + 8)
	//   which resulted in me submitting an incorrect answer. I wasted
	//   at least 1 minute because of this.
	return row * 8 + column;
}

module.exports = (input, part) => {
	const array = input.split("\n");
	let highest = 0;
	let seats = null;
	if (part === 2) {
		// SPEED IMPROVEMENT: Using seat IDs as indexes would've made it
		//   easier to write the code since initializing a 2D array wouldn't
		//   have been necessary.
		seats = new Array();
		for (var i=0; i<128; i++) {
			seats.push(new Array(8));
			for (var j=0; j<8; j++) {
				seats[i][j] = false;
			}
		}
	}
	array.forEach((seat)=>{
		// SPEED IMPROVEMENT: Treating the seat value as a 7-bit
		//   value will give you the ID. Using that ID as an index
		//   and completely ignoring the row and column values might've
		//   saved a few seconds.
		const row = parseBinary(seat.substr(0, 7));
		const column = parseBinary(seat.substr(7, 3));
		const id = getID(row, column);
		highest = Math.max(id, highest);
		if (part === 2) {
			seats[row][column] = true;
		}
	});
	if (part === 2) {
		// BLUNDER: The part 2 description took me way too long to understand.
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