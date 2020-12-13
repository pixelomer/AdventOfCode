module.exports = (input, part) => {
	const array = input.split("\n");
	if (part === 1) {
		for (let i=0; i<array.length; i++) {
			for (let j=0; j<array.length; j++) {
				if ((parseInt(array[i]) + parseInt(array[j])) === 2020) {
					return array[i] * array[j];
				}
			}
		}
	}
	else if (part === 2) {
		for (let i=0; i<array.length; i++) {
			for (let j=0; j<array.length; j++) {
				for (let k=0; k<array.length; k++) {
					if (
						(i !== j) && (i !== k) && (j !== k) &&
						((parseInt(array[i]) + parseInt(array[j]) + parseInt(array[k])) === 2020)
					) {
						return array[i] * array[j] * array[k];
					}
				}
			}
		}
	}
	return null;
};