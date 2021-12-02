module.exports = (input, part) => {
	let specs;
	if (part === 1) {
		specs = input.split("\n").map((a) => a.match(/[0-9]+/g).map((a) => +a));
	}
	else {
		const numbers = input.match(/[0-9]+/g).map((a) => +a);
		specs = [];
		for (let i=0; i<numbers.length; i+=9) {
			for (let j=0; j<3; j++) {
				specs.push([numbers[i+j], numbers[i+j+3], numbers[i+j+6]]);
			}
		}
	}
	return specs.filter((a) => (
		(a[0] + a[1] > a[2]) &&
		(a[2] + a[1] > a[0]) &&
		(a[0] + a[2] > a[1])
	)).length;
};