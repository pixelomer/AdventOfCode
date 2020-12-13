module.exports = (input, part) => {
	const array = input.split("\n");
	let checksum = 0;
	array.forEach((row)=>{
		const items = row.split("\t");
		if (part === 1) {
			checksum += Math.max(...items) - Math.min(...items);
		}
		else if (part === 2) {
			for (let i=0; i<items.length; i++) {
				for (let j=0; j<items.length; j++) {
					if (i == j) continue;
					if ((items[i] % items[j]) == 0) {
						checksum += items[i] / items[j];
						i = items.length;
						break;
					}
				}
			}
		}
	});
	return checksum;
};