module.exports = (input, part, isTest) => {
	function tryExplode(number) {
		const state = {
			didExplode: false,
			addToPrevious: (x)=>{},
			addToNext: 0
		};
		function process(number, level) {
			for (let i=0; i<number.length; i++) {
				if (state.didExplode && (state.addToNext === 0)) {
					break;
				}
				const subNumber = number[i];
				if (typeof subNumber === 'number') {
					state.addToPrevious = (x) => number[i] += x;
					number[i] += state.addToNext;
					state.addToNext = 0;
				}
				else {
					if ((level === 4) && !state.didExplode) {
						state.addToPrevious(subNumber[0]);
						state.addToNext = subNumber[1];
						number[i] = 0;
						state.didExplode = true;
					}
					else {
						process(subNumber, level+1);
					}
				}
			}
		}
		process(number, 1);
		return state.didExplode;
	}

	function trySplit(number) {
		for (let i=0; i<number.length; i++) {
			if (typeof number[i] === 'number') {
				if (number[i] >= 10) {
					number[i] = [Math.floor(number[i] / 2), Math.ceil(number[i] / 2)];
					return true;
				}
			}
			else {
				const didSplit = trySplit(number[i]);
				if (didSplit) {
					return true;
				}
			}
		}
		return false;
	}

	function getMagnitude(number) {
		if (typeof number === 'number') {
			return number;
		}
		else {
			return getMagnitude(number[0])*3 + getMagnitude(number[1])*2;
		}
	}

	function sum(a, b) {
		const number = JSON.parse(JSON.stringify([a,b]));
		let didChange;
		do { didChange = tryExplode(number) || trySplit(number); }
		while (didChange);
		return number;
	}

	input = input.split("\n").map((a) => JSON.parse(a));
	if (part === 1) {
		let number = input[0];
		for (let i=1; i<input.length; i++) {
			number = sum(number, input[i]);
		}
		return getMagnitude(number);
	}
	else {
		let max = 0;
		for (let i=0; i<input.length; i++) {
			for (let j=0; j<input.length; j++) {
				if (j === i) continue;
				const result = getMagnitude(sum(input[i], input[j]));
				if (result > max) {
					max = result;
				}
			}
		}
		return max;
	}
};