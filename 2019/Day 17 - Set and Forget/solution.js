const intcode = require("../intcode");

module.exports = (input, part) => {
	// Run the program for the first time to retrieve and inspect the map
	const program = input.split(",").map((val) => parseInt(val));
	let machine = intcode.run(program);
	const map = String
		.fromCharCode(...machine.output.reverse())
		.split("\n")
		.map((val) => val.split(""));
	let sum = 0;
	for (let y=1; y<map.length-1; y++) {
		for (let x=1; x<map[y].length-1; x++) {
			if (
				(map[y-1][x] === "#") &&
				(map[y][x-1] === "#") &&
				(map[y+1][x] === "#") &&
				(map[y][x+1] === "#") &&
				(map[y][x] === "#")
			) {
				map[y][x] = "O";
				sum += x * y;
			}
		}
	}
	if (part === 1) {
		return sum;
	}
	
	// Run the program for the second time but before doing so,
	// change the value at address 0 to 2 to wake the robot up
	program[0] = 2;
	machine = intcode.run(program);

	// Find the start position
	const offsets = [
		{ x:+1, y:0 }, // Right
		{ y:+1, x:0 }, // Down
		{ x:-1, y:0 }, // Left
		{ y:-1, x:0 }  // Up
	];
	const path = [];
	const position = { x:NaN, y:NaN };
	let currentDirection;
	(()=>{
		for (let y=0; y<map.length; y++) {
			for (let x=0; x<map[y].length; x++) {
				const directions = { "^": 3, "<": 2, ">": 0, "v": 1 };
				if ((currentDirection = directions[map[y][x]]) != null) {
					position.x = x;
					position.y = y;
					map[y][x] = ".";
					return;
				}
			}
		}
	})();

	// Find all of the necessary steps
	while (map.some((val) => val.includes("#"))) {
		const offset = offsets[currentDirection];
		if ([undefined, "."].includes((map[position.y + offset.y]??{})[position.x + offset.x])) {
			if ((path[path.length-1] + path[path.length-2]) === "RR") {
				path.splice(path.length - 2, 2, "L");
			}
			else {
				path.push("R");
			}
			currentDirection = (currentDirection + 1) % 4;
		}
		else {
			position.y += offset.y;
			position.x += offset.x;
			map[position.y][position.x] = (
				(map[position.y][position.x] === "O") ?
				"#" :
				"."
			);
			if (!isNaN(path[path.length-1])) {
				path[path.length-1]++;
			}
			else {
				path.push(1);
			}
		}
	}

	// Helper function for comparing two arrays
	function isEqual(array1, array2) {
		if (array1.length !== array2.length) return false;
		for (let i=0; i<array1.length; i++) {
			if (array1[i] !== array2[i]) {
				return false;
			}
		}
		return true;
	}

	// Merge the steps together to create the functions A, B and C
	// All 4 functions (main, A, B, C) must be 20 bytes at most
	const functions = [];
	let nextFunction = "A";
	while (nextFunction !== "D") {
		for (let i=0; i<path.length; i++) {
			if (isNaN(path[i]) && path[i].match(/[ABC]/)) continue;
			let count;
			for (count=1; count<=path.length-i; count++) {
				const slice1 = path.slice(i, i+count);
				const found = path.some((val, index) => {
					if (i === index) return false;
					if (path[i] === val) {
						const slice2 = path.slice(index, index+count);
						if ([slice1, slice2].some((slice) => slice.some((val) => String.isString(val) && val.match(/[ABC]/)))) {
							return false;
						}
						return isEqual(slice1, slice2);
					}
					return false;
				});
				if (!found) {
					count--;
					break;
				}
			}
			if (count === 0) {
				continue;
			}
			const sequence = path.slice(i, i+count);
			for (let i=path.length-count; i>=0; i--) {
				if (isEqual(sequence, path.slice(i, i+count))) {
					path.splice(i, count, nextFunction);
				}
			}
			nextFunction = String.fromCharCode(nextFunction.charCodeAt(0)+1);
			functions.push(sequence);
			break;
		}
	}

	// Generate the input text
	input = `${path.join(",")}\n`;
	functions.forEach((func) => {
		input += func.join(",") + "\n";
	});
	input += "n\n";
	machine.output = [];
	machine.input = input.split("").map((val) => val.charCodeAt(0));

	// Run the machine and return the amount of collected dust
	intcode.continueExecution(machine);
	return machine.output[0];
};