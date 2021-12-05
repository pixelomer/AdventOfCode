module.exports = (input, part, isTest) => {
	input = input.split("\n");
	const points = {};
	for (const line of input) {
		let [,x1,y1,x2,y2] = line.match(/([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)/);
		if ((part === 1) && (x1 != x2) && (y1 != y2)) {
			continue;
		}
		let [getX,getY] = [[x1,x2], [y1,y2]].map(([x1,x2]) => {
			let current = +x1;
			let target = +x2;
			let add = +1;
			if (current > +x2) {
				add = -1;
			}
			return () => {
				const val = current;
				if (val != target) {
					current += add;
				}
				return val;
			};
		});
		let x, y;
		let prevKey = null;
		while (true) {
			x = getX(), y = getY();
			const key = `${x},${y}`;
			if (key == prevKey) break;
			prevKey = key;
			points[key] = (points[key] ?? 0) + 1;
		}
	}
	const overlap = Object.values(points).filter((a) => a > 1).length;
	console.log(overlap);
	return overlap;
};