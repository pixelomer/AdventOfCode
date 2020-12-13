module.exports = (input, part) => {
	const array = input.split("");
	let sum = 0;
	for (let i=0; i<array.length; i++) {
		const check = (
			(part === 1) ?
			() => (array[i] == array[(i+1) % array.length]) :
			() => (array[i] == array[(i + (array.length / 2)) % array.length])
		)
		if (check()) {
			sum += parseInt(array[i]);
		}
	}
	return sum;
};