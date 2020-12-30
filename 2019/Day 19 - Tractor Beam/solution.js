const intcode = require("../intcode");

module.exports = (input, part) => {
	const program = input.split(",").map((val) => parseInt(val));
	
	function forceAtLocation(x, y) {
		const machine = intcode.run(program, [x, y]);
		return !!machine.output[0];
	}
	
	if (part === 1) {
		let affectedCount = 0;
		for (let y=0; y<50; y++) {
			for (let x=0; x<50; x++) {
				affectedCount += +forceAtLocation(x, y);
			}
		}
		return affectedCount;
	}

	let size = 100;
	let rightMostY = 0;
	while (true) {
		while (!forceAtLocation(size-1, rightMostY)) {
			rightMostY++;
		}
		const x = size-100;
		if (forceAtLocation(x, rightMostY+99)) {
			return (x * 10000) + rightMostY;
		}
		size++;
	}
}