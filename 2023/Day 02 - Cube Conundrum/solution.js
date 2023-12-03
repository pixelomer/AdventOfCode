/** @type { (input: string, part: number, isTest: boolean) => any } */
module.exports = (input, part, isTest) => {
	input = input.split("\n");
	let result = 0;
	const bag = { r: 12, g: 13, b: 14 };
	main: for (const line of input) {
		const [, gameID] = line.match(/^Game ([0-9]+): /);
		const parts = line.split(" ").filter((a) => a).slice(2);
		const min = { r: 0, g: 0, b: 0 };
		const boxes = { r: 0, g: 0, b: 0 };
		for (let i=0; i<parts.length; i+=2) {
			const count = +parts[i];
			boxes[parts[i+1][0]] += count;
			if (parts[i+1][parts[i+1].length-1] !== ",") {
				for (const color in boxes) {
					if (part === 2) {
						min[color] = Math.max(min[color], boxes[color]);
					}
					else if (boxes[color] > bag[color]) {
						continue main;
					}
					boxes[color] = 0;
				}
			}
		}
		if (part === 1) result += +gameID;
		else result += min.r * min.g * min.b;
	}
	return result;
};