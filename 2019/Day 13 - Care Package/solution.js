const intcode = require("../intcode");

module.exports = (input, part) => {
	const program = input.split(",").map((val) => parseInt(val));
	program[0] = 2;
	const machine = intcode.run(program);
	const screen = new Map();
	let paddleX, ballX;
	let score;

	function handleNewOutput() {
		while (machine.output.length) {
			const x = machine.output.pop();
			const y = machine.output.pop();
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
	}
	
	handleNewOutput();
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
		while (machine.state !== intcode.State.HALTED) {
			if (paddleX < ballX) {
				machine.input = [+1];
			}
			else if (paddleX > ballX) {
				machine.input = [-1];
			}
			else {
				machine.input = [0];
			}
			intcode.continueExecution(machine);
			handleNewOutput();
		}
		return score;
	}
};