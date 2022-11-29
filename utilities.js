// Greatest Common Divisor (GCD)
Math.gcd = (x, y) => {
	if (y > x) [y, x] = [x, y];

	if ((x == 0) && (y == 0)) return 1;
	if (x == 0) return y;
	if (y == 0) return x;
	if (x < 0) x = -x;
	if (y < 0) y = -y;
	if (x == y) return x;

	while (y > 0) {
		let temp2 = y;
		y = x % y;
		x = temp2;
	}

	return x;
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