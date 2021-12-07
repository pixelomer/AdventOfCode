module.exports = (input, part, isTest) => {
	function fib(x) {
		let result = 0;
		for (let i=1; i<=x; i++) {
			result += i;
		}
		return result;
	}
	input = input.split(",").map((a) => +a);
	let min = Number.MAX_SAFE_INTEGER;
	for (let i=0; i<input.length; i++) {
		let result = 0;
		for (let j=0; j<input.length; j++) {
			let fuel = Math.abs(input[j] - i);
			if (part === 2) {
				fuel = fib(fuel);
			}
			result += fuel;
		}
		min = Math.min(result, min);
	}
	return min;
};