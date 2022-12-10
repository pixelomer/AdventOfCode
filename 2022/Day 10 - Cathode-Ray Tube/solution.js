/** @type { (input: string, part: number, isTest: boolean) => any } */
module.exports = (input, part, isTest) => {
	input = input.split("\n")
	const targets = [20,60,100,140,180,220];
	const found = targets.map((a) => null);
	const output = [""];

	let cycle = 0;
	let X = 1;
	let changeX = 0;
	let pc = 0;
	let cyclesRemaining = 1;

	while (true) {
		if (--cyclesRemaining === 0) {
			X += changeX;
			let instruction = input[pc++]
			const parts = instruction?.split(" ");
			if (parts == null) break;
			if (parts[1] == null) {
				cyclesRemaining = 1;
				changeX = 0;
			}
			else {
				cyclesRemaining = 2;
				changeX = +parts[1];
			}
		}
		if ((X >= (cycle % 40) - 1) && (X <= ((cycle % 40) + 1))) {
			output[0] += "██";
		}
		else {
			output[0] += "  ";
		}
		cycle++;
		if ((cycle % 40) === 0) {
			output.unshift("");
		}
		for (let i=0; i<targets.length; i++) {
			if (cycle === targets[i]) {
				if (found[i] == null) {
					found[i] = X * cycle;
				}
			}
		}
	}
	
	if (part === 1) {
		return found.reduce((a,b) => a+b, 0);
	}
	return output.reverse();
};