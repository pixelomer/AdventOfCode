module.exports = (input, part, isTest) => {
	return input.split("\n\n")
		.map((a) => a.split("\n").map((a) => +a).reduce((a,b) => a+b))
		.sort((a,b) => b-a, 0)
		.slice(0, (part === 1) ? 1 : 3)
		.reduce((a,b) => a+b, 0);
};