module.exports = (input, part) => {
	const IDs = input.split('\n').map((a) => a.split(''));
	if (part === 1) {
		let threes = 0;
		let twos = 0;
		for (const ID of IDs) {
			const letters = {};
			for (const letter of ID) {
				letters[letter] = (letters[letter] ?? 0) + 1;
			}
			const values = Array.from(Object.values(letters));
			if (values.includes(3)) {
				threes++;
			}
			if (values.includes(2)) {
				twos++;
			}
		}
		return threes * twos;
	}
	for (let i=0; i<IDs.length; i++) {
		for (let j=0; j<IDs.length && i !== j; j++) {
			for (let k=0; k<IDs[i].length; k++) {
				const ID1 = [...IDs[i]];
				const ID2 = [...IDs[j]]
				ID1[k] = "";
				ID2[k] = "";
				if (ID1.join('') === ID2.join('')) {
					return ID1.join('');
				}
			}
		}
	}
};