const intcode = require("../intcode");

module.exports = (input, part) => {
	const program = input.split(",").map((val) => parseInt(val));
	const machine = intcode.run(program);
	const map = new Map();
	if (part === 2) map.set("0,0", 1);
	const offsets = [
		{ dx: 0, dy: -1 },
		{ dx: -1, dy: 0 },
		{ dx: 0, dy: +1 },
		{ dx: +1, dy: 0 }
	];
	let direction = 0;
	let x = 0;
	let y = 0;
	let minX, maxX, minY, maxY;
	minX = minY = Number.MAX_SAFE_INTEGER;
	maxX = maxY = Number.MIN_SAFE_INTEGER;
	while (machine.state == intcode.State.SUSPENDED) {
		let key = `${x},${y}`;
		machine.input = [map.get(key) ?? 0];
		intcode.continueExecution(machine);
		const newColor = machine.output.pop();
		const directionChange = machine.output.pop();
		if (directionChange == 1) {
			direction = (direction + 3) % 4;
		}
		else {
			direction = (direction + 1) % 4
		}
		map.set(key, newColor);
		x += offsets[direction].dx;
		y += offsets[direction].dy;
		minX = Math.min(minX, x);
		minY = Math.min(minY, y);
		maxX = Math.max(maxX, x);
		maxY = Math.max(maxY, y);
	}
	if (part === 1) {
		return map.size;
	}
	else {
		let result = "";
		for (let y=minY; y<=maxY; y++) {
			for (let x=minX; x<=maxX; x++) {
				result += map.get(`${x},${y}`) ? "#" : " ";
			}
			result += "\n";
		}
		return result.substr(0, result.length-1);
	}
};