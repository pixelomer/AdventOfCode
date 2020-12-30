const intcode = require("../intcode");
const v8 = require("v8");

module.exports = (input, part) => {
	const program = input.split(",").map((val) => parseInt(val));
	const map = new Map();
	const position = { x:0, y:0 };
	const offsets = [
		{ y:-1, x:0 },
		{ y:+1, x:0 },
		{ x:-1, y:0 },
		{ x:+1, y:0 }
	];
	const machine = intcode.run(program);
	machine.output = [];
	let direction;
	let minX, minY, maxX, maxY;
	const path = [];
	minX = minY = Number.MAX_SAFE_INTEGER;
	maxX = maxY = Number.MIN_SAFE_INTEGER;
	let key = "0,0";
	let i = 0;
	while (machine.state === intcode.State.SUSPENDED) {
		direction = map.get(key) ?? 0;
		map.set(key, (direction - 1 + 4) % 4);
		machine.input = [direction+1];
		intcode.continueExecution(machine);
		const output = machine.output.pop();
		const blockPosition = { x: position.x, y: position.y };
		blockPosition.x += offsets[direction].x ?? 0;
		blockPosition.y += offsets[direction].y ?? 0;
		minX = Math.min(minX, blockPosition.x);
		minY = Math.min(minY, blockPosition.y);
		maxX = Math.max(maxX, blockPosition.x);
		maxY = Math.max(maxY, blockPosition.y);
		if (output > 0) {
			position.x += offsets[direction].x;
			position.y += offsets[direction].y;
			key = `${position.x},${position.y}`;
			if (!map.get(key)) {
				map.set(key, direction);
			}
			if (key === path[path.length-2]) {
				path.pop();
			}
			else {
				path.push(key);
			}
			if (output == 2) {
				//FIXME: There's gotta be a better way to do this
				if (++i == 30) break;
			}
		}
		else {
			map.set(`${blockPosition.x},${blockPosition.y}`, null);
		}
	}
	if (machine.state !== intcode.State.SUSPENDED) {
		console.log("Unexpected state:", intcode.State[machine.state]);
		return;
	}
	if (part === 1) {
		return path.length;
	}
	let str = "\n";
	let finalMap = [];
	for (let y=minY; y<=maxY; y++) {
		const line = [];
		for (let x=minX; x<=maxX; x++) {
			if ((y === position.y) && (x === position.x)) {
				line.push("O");
				continue;
			}
			const value = map.get(`${x},${y}`);
			if (value === undefined) line.push(" ");
			else if (value === null) line.push("#");
			else line.push(".");
		}
		finalMap.push(line);
	}
	let timeElapsed = 0;
	while (finalMap.some((line) => line.some((val) => val == "."))) {
		const newFinalMap = v8.deserialize(v8.serialize(finalMap));
		for (let y=0; y<finalMap.length; y++) {
			for (let x=0; x<finalMap[y].length; x++) {
				if (finalMap[y][x] === "O") {
					offsets.forEach((offset) => {
						if (newFinalMap[y + offset.y][x + offset.x] === ".") {
							newFinalMap[y + offset.y][x + offset.x] = "O";
						}
					});
				}
			}
		}
		finalMap = newFinalMap;
		timeElapsed++;
	}
	return timeElapsed;
};