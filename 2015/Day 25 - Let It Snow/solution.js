module.exports = (input, part) => {
	if (part === 2) {
		console.log("There is no part 2.");
		return;
	}
	const [,targetY,targetX] = input.match(/row ([0-9]+), column ([0-9]+)/);
	let x = 1, y = 1;
	let code = 20151125;
	while (true) {
		if (y === 1) {
			y = x + 1;
			x = 1;
		}
		else {
			x++;
			y--;
		}
		code = (code * 252533) % 33554393;
		if ((targetY == y) && (targetX == x)) {
			break;
		}
	}
	return code;
};