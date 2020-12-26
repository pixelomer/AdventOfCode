module.exports = (input, part) => {
	const wires = input.split("\n");

	const points = {};
	let result = Number.MAX_SAFE_INTEGER;
	for (let i=0; i<2; i++) {
		const offsets = {
			U: { y:-1 }, D: { y:+1 },
			L: { x:-1 }, R: { x:+1 }
		};
		const currentPosition = { x:0, y:0 };
		let counter = 0;
		wires[i].split(",").some((move) => {
			const count = parseInt(move.substr(1));
			const offset = offsets[move[0]];
			for (let j=0; j<count; j++) {
				counter++;
				currentPosition.x += offset.x ?? 0;
				currentPosition.y += offset.y ?? 0;
				const key = `${currentPosition.x},${currentPosition.y}`;
				if (i === 0) {
					points[key] = points[key] ?? counter;
				}
				else if (points[key] != null) {
					if (part === 1) {
						result = Math.min(Math.abs(currentPosition.x) + Math.abs(currentPosition.y), result);
					}
					else {
						result = Math.min(points[key] + counter, result);
					}
				}
			}
		});
	}
	return result;
};