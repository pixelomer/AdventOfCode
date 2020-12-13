module.exports = (input, part) => {
	const array = input.split("\n");
	const lights = new Map();
	array.forEach((commandStr)=>{
		const match = commandStr.match(/((?:turn on)|(?:turn off)|(?:toggle)) ([0-9]{1,3}),([0-9]{1,3}) through ([0-9]{1,3}),([0-9]{1,3})/);
		const command = match[1];
		const x1 = parseInt(match[2]);
		const y1 = parseInt(match[3]);
		const x2 = parseInt(match[4]);
		const y2 = parseInt(match[5]);
		for (let x=x1; x<=x2; x++) {
			for (let y=y1; y<=y2; y++) {
				// This can be used as a key because the maximum
				// value for x and y is 999.
				let key = (x*1000 + y);
				if (part === 1) {
					if (command === "turn on") {
						lights.set(key, 1);
					}
					else if (command === "turn off") {
						lights.set(key, 0);
					}
					else if (command === "toggle") {
						lights.set(key, +!(lights.get(key) ?? 0));
					}
				}
				else if (part === 2) {
					const current = lights.get(key) ?? 0;
					if (command === "turn on") {
						lights.set(key, current+1);
					}
					else if (command === "turn off") {
						lights.set(key, Math.max(current-1, 0));
					}
					else if (command === "toggle") {
						lights.set(key, current+2);
					}
				}
			}
		}
	});
	let sum = 0;
	lights.forEach((value)=>{
		sum += value;
	});
	return sum;
}