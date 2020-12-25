module.exports = (input, part) => {
	if (part === 2) {
		return null;
	}
	
	const split = input.split("\n");
	const doorPublicKey = parseInt(split[0]);
	const cardPublicKey = parseInt(split[1]);

	function transformOnce(value, subjectNumber) {
		return (value * subjectNumber) % 20201227;
	}

	function transform(subjectNumber, loopSize) {
		let value = 1;
		for (let i=0; i<loopSize; i++) {
			value = transformOnce(value, subjectNumber);
		}
		return value;
	}

	function findLoopSize(publicKey) {
		let loopSize = 1;
		let value = 1;
		while (true) {
			value = transformOnce(value, 7);
			if (value == publicKey) return loopSize;
			loopSize++;
		}
	}

	const doorLoopSize = findLoopSize(doorPublicKey);

	return transform(cardPublicKey, doorLoopSize);
};