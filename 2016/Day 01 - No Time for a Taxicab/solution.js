module.exports = (input, part) => {
	const steps = input.match(/[RL][0-9]+/g);
	let direction = 0;
	let x=0, y=0;
	const getDistance = () => Math.abs(x) + Math.abs(y);
	const visited = new Set();
	for (const step of steps) {
		const change = +step.slice(1);
		if (step[0] == 'L') direction--;
		else direction++;
		if (direction == -1) direction = 3;
		else direction %= 4;
		for (let i=0; i<change; i++) {
			if (part === 2) {
				visited.add(`${x},${y}`);
			}
			switch (direction) {
				case 0: x++; break;
				case 1: y++; break;
				case 2: x--; break;
				case 3: y--; break;
			}
			if (part === 2) {
				if (visited.has(`${x},${y}`)) {
					return getDistance();
				}
			}
		}
	}
	if (part === 1) {
		return getDistance();
	}
};