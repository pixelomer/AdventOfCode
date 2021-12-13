const { serialize, deserialize } = require('v8');

module.exports = (input, part, isTest) => {
	input = input.split("\n");

	const SCREEN_WIDTH = isTest ? 7 : 50;
	const SCREEN_HEIGHT = isTest ? 3 : 6;
	
	let backbuffer = [];
	let screen;

	for (let y=0; y<SCREEN_HEIGHT; y++) {
		backbuffer[y] = [];
		for (let x=0; x<SCREEN_WIDTH; x++) {
			backbuffer[y][x] = false;
		}
	}

	function get(x, y) {
		return screen[y % SCREEN_HEIGHT][x % SCREEN_WIDTH];
	}
	function set(x, y, on) {
		backbuffer[y % SCREEN_HEIGHT][x % SCREEN_WIDTH] = on;
	}
	function commit() {
		screen = deserialize(serialize(backbuffer));
	}
	
	commit();

	function renderScreen() {
		let rendered = screen.map((row) => row.map((pixel) => pixel ? "#" : " ").join(""));
		return rendered.join("\n");
	}

	for (const instruction of input) {
		let match;
		if (match = instruction.match(/rect ([0-9]+)x([0-9]+)/)) {
			const [,width,height] = match;
			for (let x=0; x<+width; x++) {
				for (let y=0; y<+height; y++) {
					set(x, y, true);
				}
			}
		}
		else if (match = instruction.match(/ x=([0-9]+) by ([0-9]+)/)) {
			let [,x,count] = match;
			for (let y=SCREEN_HEIGHT-1; y>=0; y--) {
				set(+x, y+ +count, get(+x,y));
			}
		}
		else if (match = instruction.match(/ y=([0-9]+) by ([0-9]+)/)) {
			let [,y,count] = match;
			for (let x=SCREEN_WIDTH-1; x>=0; x--) {
				set(x+ +count, +y, get(x,+y));
			}
		}
		commit();
	}
	if (part === 1) {
		let sum = screen.reduce((a,b) => b.reduce((a,b) => a+b, 0)+a, 0);
		return sum;
	}
	else {
		console.log("Cannot decode this programmatically, you are on your own here");
		console.log("\n" + renderScreen());
		return {};
	}
};