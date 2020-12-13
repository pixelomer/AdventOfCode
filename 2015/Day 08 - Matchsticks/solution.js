module.exports = (input, part) => {
	const array = input.split("\n");
	let sum = 0;
	array.forEach((str)=>{
		if (part === 1) {
			sum += str.length - eval(str).length;
		}
		else if (part === 2) {
			sum += JSON.stringify(str).length - str.length;
		}
	});
	return sum;
};