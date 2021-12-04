module.exports = (input, part) => {
	function decompress(input) {
		let length = 0;
		while (input.length !== 0) {
			if (input[0] === "(") {
				const [descriptor,charCount,repeat] = input.match(/\(([0-9]+)x([0-9]+)\)/);
				input = input.slice(descriptor.length);

				const stringToRepeat = input.slice(0, +charCount);
				input = input.slice(+charCount);
				
				if (part === 2) {
					let subLength = decompress(stringToRepeat);
					length += subLength * repeat;
				}
				else {
					length += stringToRepeat.length * repeat;
				}
			}
			else {
				const rawData = input.match(/[^(]+/)[0];
				input = input.slice(rawData.length);

				length += rawData.length;
			}
		}
		return length;
	}
	return decompress(input);
};