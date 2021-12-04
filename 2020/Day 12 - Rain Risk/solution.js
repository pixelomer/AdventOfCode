module.exports = (input, part) => {
	const E=0, S=1, W=2, N=3;
	const commands = input.split("\n");
	let direction = E;
	let positions = new Array(4);
	let wayPoint = new Array(4);
	positions.fill(0);
	wayPoint.fill(0);
	wayPoint[E] = 10;
	wayPoint[N] = 1;
	commands.forEach((item)=>{
		const arg = parseInt(item.substr(1));
		if (part === 1) {
			switch (item[0]) {
				case "L": direction -= arg / 90; break;
				case "R": direction += arg / 90; break;
				case "N": positions[N] += arg; break;
				case "S": positions[S] += arg; break;
				case "E": positions[E] += arg; break;
				case "W": positions[W] += arg; break;
				case "F": positions[direction] += arg; break;
			}
			if (direction < 0) direction += 4;
			direction %= 4;
		}
		else {
			switch (item[0]) {
				case "L":
					for (let i=0; i<arg/90; i++) wayPoint.push(wayPoint.shift());
					break;
				case "R":
					for (let i=0; i<arg/90; i++) wayPoint.unshift(wayPoint.pop());
					break;
				case "N": wayPoint[N] += arg; break;
				case "S": wayPoint[S] += arg; break;
				case "E": wayPoint[E] += arg; break;
				case "W": wayPoint[W] += arg; break;
				case "F":
					for (let i=0; i<4; i++) positions[i] += wayPoint[i] * arg;
					break;
			}
		}
	});
	return (
		Math.abs(positions[E] - positions[W])
		+ Math.abs(positions[N] - positions[S])
	);
};