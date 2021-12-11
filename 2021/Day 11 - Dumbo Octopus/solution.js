module.exports = (input, part, isTest) => {
	input = input.split("\n").map((a) => a.split("").map((a) => +a));
	let flashCount = 0;
	let step = 1;
	while (true) {
		const didFlash = new Set();
		let willFlash = [];
		for (let y=0; y<input.length; y++) {
			for (let x=0; x<input[y].length; x++) {
				if (++input[y][x] == 10) {
					didFlash.add(`${x},${y}`);
					willFlash.push([x,y]);
					input[y][x] = 0;
					flashCount++;
				}
			}
		}
		while (willFlash.length > 0) {
			let flashing = willFlash;
			willFlash = [];
			for (const [x,y] of flashing) {
				for (let sy=y-1; sy<=y+1; sy++) {
					if (input[sy] == null) continue;
					for (let sx=x-1; sx<=x+1; sx++) {
						if (input[sy][sx] == null) continue;
						if (didFlash.has(`${sx},${sy}`)) continue;
						if (++input[sy][sx] == 10) {
							didFlash.add(`${sx},${sy}`)
							willFlash.push([sx,sy]);
							input[sy][sx] = 0;
							flashCount++;
						}
					}
				}
			}
		}
		if ((part === 1) && (step === 100)) {
			break;
		}
		if ((part === 2) && (didFlash.size === input.length * input[0].length)) {
			return step;
		}
		step++;
	}
	return flashCount;
};