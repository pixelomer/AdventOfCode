module.exports = (input, part) => {
	
	function incrementNumber(input) {
		// Overflows are not handled, so "zz" will become "aa" instead of "aaa"
		// (not that it really matters; there is an 8 character limit anyway)
		const result = input.split("");
		function incrementDigit(digit) {
			if (digit == "z") return "a";
			else return String.fromCharCode(digit.charCodeAt(digit)+1);
		}
		for (let i=input.length-1; i>=0; i--) {
			const newDigit = incrementDigit(input[i]);
			result[i] = newDigit;
			if (newDigit != "a") break;
		}
		return result.join("");
	}

	function allCharacterSequences(length) {
		// {length:1} => [ "a", "b", "c", ..., "w", "x", "y", "z"]
		// {length:2} => [ "ab", "bc", "cd", ..., "wx", "xy", "yz"]
		// {length:3} => [ "abc", "bcd", "cde", ..., "wxy", "xyz"]
		// {length:4} => [ "abcd", "bcde", "cdef", ..., "wxyz"]
		// ...
		const result = new Array();
		for (let i=0; i<=(26 - length); i++) {
			let str = "";
			for (let j=0; j<length; j++) {
				str += String.fromCharCode("a".charCodeAt(0) + i + j);
			}
			result.push(str);
		}
		return result;
	}

	const sequences = allCharacterSequences(3);
	let match = null;
	
	function findNext() {
		do input = incrementNumber(input);
		while ((() => {
			const match = input.match(/([a-z])\1/g);
			if ((match == null) || (match.length < 2)) return true;
			if (input.match(/[iol]/g)) return true;
			if (!sequences.some((value) => input.includes(value))) return true;
			return false;
		})());
	}
	for (let i=0; i<part; i++) {
		findNext();
	}

	return input;
};