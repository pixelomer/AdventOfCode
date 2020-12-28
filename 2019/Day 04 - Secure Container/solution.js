module.exports = (input, part) => {
	const split = input.split("-").map(val => parseInt(val));
	let start = Math.max(split[0], 100000);
	let end = Math.min(split[1], 999999);
	if (end < start) {
		[end, start] = [start, end];
	}
	let count = 0;
	for (let i=start; i<=end; i++) {
		const str = i.toString();
		const matches = str.match(/([0-9])\1+/g);
		if (matches == null) {
			continue;
		}
		if ((part === 2) && !matches.some((val) => val.length == 2)) {
			continue;
		}
		const array = str.split("").map(val => parseInt(val));
		let max = -1;
		let j;
		for (j=0; j<6; j++) {
			if (max > array[j]) break;
			max = array[j];
		}
		if (j != 6) {
			continue;
		}
		count++;
	}
	return count;
};