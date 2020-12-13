module.exports = (input, part) => {
	const array = input.split("\n");
	let total = 0;
	if (array.some((dimensions)=>{
		const match = dimensions.match(/^([0-9]+)x([0-9]+)x([0-9]+)$/);
		if (!match) return true;
		const length = parseInt(match[1]);
		const width = parseInt(match[2]);
		const height = parseInt(match[3]);
		if (part === 2) {
			const sizes = [length, width, height].sort((a,b)=>(a-b)).slice(0, 2);
			const bowSize = length * width * height;
			const wrapSize = (sizes[0] + sizes[1]) * 2;
			total += bowSize + wrapSize;
		}
		else if (part === 1) {
			const area = (
				(2 * length * width)
				+ (2 * length * height)
				+ (2 * width * height)
			);
			const additionalPaper = Math.min(
				(length * width),
				(length * height),
				(width * height)
			);
			total += area + additionalPaper;
		}
		return false;
	})) return null;
	return total;
}; 