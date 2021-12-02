module.exports = (input, part, isTest) => {
	input = input.split("\n");
	let depth = 0;
	let position = 0;
	let aim = 0;
	for (let line of input) {
		const [command, num] = line.split(" ");
		switch (command) {
			case "forward":
				if (part === 2) {
					depth += +num * aim;
				}
				position += +num; break;
			case "down":
				aim += +num;
				if (part !== 2) depth += +num;
				break;
			case "up":
				aim -= +num;
				if (part !== 2) depth -= +num;
				break;
		}
	}
	return depth * position;
};