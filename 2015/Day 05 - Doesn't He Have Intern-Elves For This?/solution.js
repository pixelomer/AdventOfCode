module.exports = (input, part) => {
	const array = input.split("\n");
	const illegalSequences = ["ab", "cd", "pq", "xy"];
	let niceCount = 0;
	array.forEach((string)=>{
		if (part === 1) {
			if (
				string.match(/(.)\1/g)
				&& ((string.match(/[aeiou]/g) ?? "").length >= 3)
				&& !string.match(/(ab)|(cd)|(pq)|(xy)/g)
			) {
				niceCount++;
			}
		}
		else if (part === 2) {
			if (string.match(/(..).*\1/g) && string.match(/(.).\1/g)) {
				niceCount++;
			}
		}
	});
	return niceCount;
};