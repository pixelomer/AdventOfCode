module.exports = (input, part, isTest) => {
	input = input.split("\n").map((a) => a.split(""));
	const lowPoints = [];
	for (let y=0; y<input.length; y++) {
		for (let x=0; x<input[y].length; x++) {
			const f = (x) => isNaN(x) ? Number.MAX_SAFE_INTEGER : x;
			const min = Math.min(
				f(+input[y][x-1]),
				f(+input[y][x+1]),
				f(+input[y-1]?.[x]),
				f(+input[y+1]?.[x]),
			);
			if (input[y][x] < min) {
				lowPoints.push({ x, y });
			}
		}
	}
	if (part === 1) {
		return lowPoints.reduce((a,b) => a + (+input[b.y][b.x] + 1), 0);
	}
	let sizes = [];
	for (const lowPoint of lowPoints) {
		const points = [lowPoint];

		const checked = new Set();
		function findPoints(x, y) {
			function tryPosition(x, y) {
				if (!checked.has(`${x},${y}`)) {
					checked.add(`${x},${y}`);
					findPoints(x, y);
				}
			}
			if ((input[y]?.[x] == null) || (input[y]?.[x] == 9)) {
				return;
			}
			points.push({ x, y });
			tryPosition(x+1, y);
			tryPosition(x, y+1);
			tryPosition(x-1, y);
			tryPosition(x, y-1);
		}

		findPoints(lowPoint.x, lowPoint.y);
		sizes.push(points.length);
	}
	sizes = sizes.sort((a, b) => b - a);
	console.log(sizes);
	return sizes.slice(0, 3).reduce((a,b) => a*(b-2), 1);
};