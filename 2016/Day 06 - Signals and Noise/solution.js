module.exports = (input, part) => {
	input = input.split("\n");
	let message = "";
	for (let i=0; i<input[0].length; i++) {
		const grouped = {};
		for (let j=0; j<input.length; j++) {
			grouped[input[j][i]] = (grouped[input[j][i]] ?? 0) + 1;
		}
		const sorter = (part === 1) ? ((a,b) => b[1]-a[1]) : ((a,b) => a[1]-b[1]);
		message += Object.entries(grouped).sort(sorter)[0][0];
	}
	return message;
};