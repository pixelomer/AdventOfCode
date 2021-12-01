module.exports = (input, part, isTest) => {
	input = input.split("\n");
	let a = 0;
	if (part === 1) {
		for (let i=1; i<input.length; i++) {
			if (+input[i] > +input[i-1]) {
				a++;
			}
		}
	}
	else {
		let windows = [+input[0], +input[1], +input[2]];
		let prev = windows.reduce((a, b) => a + b, 0);
		for (let i=3; i<input.length; i++) {
			windows.push(+input[i]);
			windows.splice(0, 1);
			let sum = windows.reduce((a, b) => a + b, 0);
			if (sum > prev) {
				a++;
			}
			prev = sum;
		}
	}
	return a;
};