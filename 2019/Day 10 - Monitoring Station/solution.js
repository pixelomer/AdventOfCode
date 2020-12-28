module.exports = (input, part) => {
	if (part === 2) {
		// Part 2 solution is not available
		return;
	}

	input = input.split("\n");
	const height = input.length;
	const width = input[0].length;

	const angles = [];

	for (let dx=0; dx<=width; dx++) {
		for (let dy=0; dy<=height; dy++) {
			if ((dx == 0) && (dy == 0)) continue;
			if (Math.gcd(dx, dy) === 1) {
				angles.push({ dx, dy });
			}
		}
	}

	let count = Number.MIN_SAFE_INTEGER;
	let bestX, bestY;
	for (let y=0; y<height; y++) {
		for (let x=0; x<width; x++) {
			if (input[y][x] != "#") continue;
			const set = new Set()
			angles.forEach((_angle) => {
				const multipliers = [
					{ dx:+1, dy:+1 }, { dx:+1, dy:-1 },
					{ dx:-1, dy:+1 }, { dx:-1, dy:-1 }
				];
				multipliers.forEach((multiplier) => {
					const angle = {
						dx: _angle.dx * multiplier.dx,
						dy: _angle.dy * multiplier.dy,
					};
					let sx = x;
					let sy = y;
					do {
						sx += angle.dx;
						sy += angle.dy;
					}
					while (((input[sy] ?? {})[sx] != null) && ((input[sy] ?? {})[sx] != "#"));
					if ((input[sy] ?? {})[sx] == "#") {
						set.add(`${sx},${sy}`);
					}
				});
			});
			if (set.size > count) {
				bestX = x;
				bestY = y;
				count = set.size;
			}
		}
	}
	return count;
};