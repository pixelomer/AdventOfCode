module.exports = (input, part, isTest) => {
	input = input.split("\n");
	let z = 0; 
	for (const line of input) {
		const match = line.match(/^(\d+)-(\d+),(\d+)-(\d+)$/);
		const [_,a,b,c,d] = [...match].map((a) => +a);
		if (part === 2) {
			for (let i=a; i<=b; i++) {
				if ((i >= c) && (i <= d)) {
					z++;
					break;
				}
			}
		}
		else {
			if (((a >= c) && (b <= d)) || ((a <= c) && (b >= d))) {
				z++;
			}
		}
	}
	return z;
};