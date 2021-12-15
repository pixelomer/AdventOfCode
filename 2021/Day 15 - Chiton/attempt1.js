// This solution does not work because it assumes that
// the submarine can only go right and down.

module.exports = (input, part, isTest) => {
	const map = input.split("\n").map((a) => a.split("").map((a) => +a));
	const riskMap = [];

	const MULTIPLIER = (part === 1) ? 1 : 5;
	const INPUT_WIDTH = map[0].length;
	const INPUT_HEIGHT = map.length;
	const REAL_WIDTH = INPUT_WIDTH * MULTIPLIER;
	const REAL_HEIGHT = INPUT_HEIGHT * MULTIPLIER;

	function get(x,y) {
		const change = Math.floor(x / INPUT_WIDTH) + Math.floor(y / INPUT_HEIGHT);
		x %= INPUT_WIDTH;
		y %= INPUT_HEIGHT;
		return (map[y][x] - 1 + change) % 9 + 1;
	}

	for (let x=REAL_WIDTH-1; x>=0; x--) {
		for (let y=REAL_HEIGHT-1; y>=0; y--) {
			riskMap[y] = riskMap[y] ?? [];
			const right = riskMap[y]?.[x+1] ?? Number.MAX_SAFE_INTEGER;
			const down = riskMap[y+1]?.[x] ?? Number.MAX_SAFE_INTEGER;
			const risk = get(x, y);

			if ((right == Number.MAX_SAFE_INTEGER) && (down == Number.MAX_SAFE_INTEGER)) {
				riskMap[y][x] = risk;
			}
			else if (right <= down) {
				riskMap[y][x] = right + risk;
			}
			else {
				riskMap[y][x] = down + risk;
			}
		}
	}

	console.log(riskMap);

	return riskMap[0][0] - 1;
};