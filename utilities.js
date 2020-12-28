String.isString = (obj) => {
	return (Object.prototype.toString.call(obj) === '[object String]');
}

Array.permutations = (array) => {
	const permutations = [];

	function findPermutations(inArray, outArray) {
		if (inArray.length === 0) {
			permutations.push(outArray);
		}
		else {
			for (let i=0; i<inArray.length; i++) {
				const newInArray = [...inArray];
				const newOutArray = [...outArray];
				newInArray.splice(i, 1);
				newOutArray.push(inArray[i]);
				findPermutations(newInArray, newOutArray);
			}
		}
	}

	findPermutations(array, []);
	return permutations;
};