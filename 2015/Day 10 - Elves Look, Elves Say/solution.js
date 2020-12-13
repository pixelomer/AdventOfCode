module.exports = (input, part) => {
	function play(input) {
		let output = "";
		for (let i=0; i<input.length; i++) {
			let count = 1;
			const digit = input[i];
			while (input[++i] == digit) {
				count++;
			}
			i--;
			output = `${output}${count}${digit}`;
		}
		return output;
	}
	for (let i=0; i<((part === 1) ? 40 : 50); i++) {
		input = play(input);
	}
	return input.length;
};