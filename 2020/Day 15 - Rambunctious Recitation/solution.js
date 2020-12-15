const UINT32_MAX = 0xFFFFFFFF;

module.exports = (input, part) => {
	const numbers = input.split(",").map((x) => parseInt(x));
	const target = (part === 1) ? 2020 : 30000000;
	if (target >= UINT32_MAX) {
		console.error("solution.js: target is too large");
		return null;
	}
	let cache = new Uint32Array(0);
	let prevNumber, prevIndex, prevIndexForNumber;
	function insertToCache(number, index) {
		if (cache.length <= number) {
			const oldCache = cache;
			cache = new Uint32Array(2 * (number+1));
			cache.set(oldCache);
			cache.fill(UINT32_MAX, oldCache.length);
			delete oldCache;
		}
		prevIndexForNumber = cache[number];
		cache[number] = index;
		prevNumber = number;
		prevIndex = index;
	}
	numbers.forEach((num, index)=>{
		insertToCache(num, index);
	});
	delete numbers;
	for (let i=numbers.length; i<target; i++) {
		if (prevIndexForNumber == UINT32_MAX) {
			insertToCache(0, i);
		}
		else {
			insertToCache(prevIndex - prevIndexForNumber, i);
		}
	}
	return prevNumber;
};