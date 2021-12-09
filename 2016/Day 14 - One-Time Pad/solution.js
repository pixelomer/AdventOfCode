//FIXME: Part 2 takes too long to execute (~1 minute)

const crypto = require('crypto');

function md5(data) {
	return crypto.createHash('md5').update(data).digest('hex');
}

module.exports = (input, part) => {
	const hashes = [];
	function getHash(index) {
		if (hashes[index] != null) {
			return hashes[index];
		}
		let hash = md5(`${input}${index}`);
		if (part === 2) {
			for (let i=0; i<2016; i++) {
				hash = md5(hash);
			}
		}
		return hashes[index] = hash;
	}
	let nextKeyIndex = 0;
	let currentIndex = 0;
	while (nextKeyIndex < 64) {
		let pattern = getHash(currentIndex).match(/(.)\1\1/g)?.[0];
		if (pattern != null) {
			pattern += pattern.slice(0,2);
			for (let i=1; i<1000; i++) {
				if (getHash(currentIndex + i).includes(pattern)) {
					console.log(nextKeyIndex, currentIndex, pattern, getHash(currentIndex), getHash(currentIndex + i));
					nextKeyIndex++;
					break;
				}
			}
		}
		currentIndex++;
	}
	return currentIndex - 1;
};