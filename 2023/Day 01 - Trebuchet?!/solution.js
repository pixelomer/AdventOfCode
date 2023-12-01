/** @type { (input: string, part: number, isTest: boolean) => any } */
module.exports = (input, part, isTest) => {
	let nums = { 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9 };
	if (part === 2) {
		nums = { ...nums, "one": 1, "two": 2, "three": 3, "four": 4,
			"five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9 };
	}
	return input.split("\n").reduce((acc, line) => {
		let num = 0;
		const walk = (gen) => {
			for (const idx of gen()) {
				for (const numStr in nums) {
					if (numStr === line.substring(idx, numStr.length + idx)) {
						return nums[numStr];
					}
				}
			}
		}
		num += 10 * walk( (function*() { for (let i=0; i<line.length; i++) yield i;    }) );
		num +=  1 * walk( (function*() { for (let i=line.length-1; i>=0; i--) yield i; }) );
		return acc + num;
	}, 0);
};