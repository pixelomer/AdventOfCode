const intcode = require("../intcode");

module.exports = (input, part) => {
	if (part === 2) return;

	const program = input.split(",").map((val) => parseInt(val));
	program[0] = 2;
	const machine = intcode.run(program);
	const screen = new Map();
	let paddleX;
	let ballX;
	let score;
	let minX, minY, maxX, maxY;
	minY = minX = Number.MAX_SAFE_INTEGER;
	maxX = maxY = Number.MIN_SAFE_INTEGER;
	function handleNewOutput() {
		const x = machine.output.pop();
		const y = machine.output.pop();
		maxY = Math.max(maxY, y);
		maxX = Math.max(maxX, x);
		minY = Math.min(minY, y);
		minX = Math.min(minX, x);
		const tileID = machine.output.pop();
		if ((x === -1) && (y === 0)) {
			score = tileID;
		}
		else if (tileID === 3) {
			paddleX = x;
		}
		else if (tileID === 4) {
			ballX = x;
		}
		screen.set(`${x},${y}`, tileID);
	}
	
	while (machine.output.length) {
		handleNewOutput();
	}
	if (part === 1) {
		const iterator = screen.values();
		let tileID = iterator.next();
		let blockTileCount = 0;
		while (!tileID.done) {
			if (tileID.value == 2) {
				blockTileCount++;
			}
			tileID = iterator.next();
		}
		return blockTileCount;
	}
	else {
		// This code doesn't work
		/*while (machine.state !== intcode.State.HALTED) {
			if (paddleX < ballX) {
				machine.input = [+1];
			}
			else if (paddleX > ballX) {
				machine.input = [-1];
			}
			else {
				machine.input = [+1];
			}
			intcode.continueExecution(machine);
			handleNewOutput();
		}
		console.log("Score:", score);*/
	}
};