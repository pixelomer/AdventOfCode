// BLUNDER: When you attempt to replace a character in
//  a string with `string[x] = char` in JavaScript,
//  the character won't be replaced. However, an error
//  won't be thrown either. It took me way too long to
//  realize that.

module.exports = (input, part) => {
	const array = input.split("\n");
	let currentState = array;
	while (true) {
		let newState = Array.from(currentState);
		for (let x=0; x<currentState.length; x++) {
			for (let y=0; y<currentState[x].length; y++) {
				if (currentState[x][y] == ".") {
					continue;
				}
				let test = null;
				let seatCount = 0;
				function validatePosition(x, y) {
					return (
						(x >= 0)
						&& (y >= 0)
						&& (x < currentState.length)
						&& (y < currentState[x].length)
					);
				}
				if (part === 1) {
					test = (dx,dy) => {
						const sx = x + dx;
						const sy = y + dy;
						if (validatePosition(sx, sy) && currentState[sx][sy] == "#") {
							seatCount++;
						}
					};
				}
				else if (part === 2) {
					test = (dx,dy) => {
						for (let sx=x+dx,sy=y+dy; validatePosition(sx, sy); sx+=dx, sy+=dy) {
							if (currentState[sx][sy] == "L") break;
							if (currentState[sx][sy] == "#") {
								seatCount++;
								break;
							}
						}
					}
				}
				for (let dx=-1; dx<=+1; dx++) {
					for (let dy=-1; dy<=+1; dy++) {
						if (!dx && !dy) continue;
						test(dx, dy);
					}
				}
				let replacement = newState[x][y];
				if (seatCount >= (part + 3)) {
					replacement = "L";
				}
				else if (seatCount == 0) {
					replacement = "#";
				}
				newState[x] = newState[x].substring(0, y) + replacement + newState[x].substring(y+1);
			}
		}
		if (newState.join("") === currentState.join("")) {
			return newState.join("").match(/#/g).length;
		}
		currentState = newState;
	}
};