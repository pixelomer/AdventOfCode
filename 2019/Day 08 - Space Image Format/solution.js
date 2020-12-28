module.exports = (input, part) => {
	const LAYER_WIDTH = 25;
	const LAYER_HEIGHT = 6;

	const layers = [];
	let minZeroCount = Number.MAX_SAFE_INTEGER;
	let multiplied = null;
	while (input.length) {
		let flatLayer = input.substr(0, (LAYER_WIDTH * LAYER_HEIGHT));
		const zeroCount = (flatLayer.match(/0/g) ?? "").length;
		const oneCount = (flatLayer.match(/1/g) ?? "").length;
		const twoCount = (flatLayer.match(/2/g) ?? "").length;
		input = input.substr(LAYER_WIDTH * LAYER_HEIGHT);
		const layer = [];
		for (let i=0; i<LAYER_HEIGHT; i++) {
			layer.push(flatLayer.substr(0, LAYER_WIDTH));
			flatLayer = flatLayer.substr(LAYER_WIDTH);
		}
		layers.push(layer);
		if (zeroCount < minZeroCount) {
			multiplied = oneCount * twoCount;
			minZeroCount = zeroCount;
		}
	}

	if (part === 1) {
		return result;
	}

	return layers.reduceRight((acc, val) => {
		if (acc == null) {
			return val.map(val => val.split(""));
		}
		for (let y=0; y<LAYER_HEIGHT; y++) {
			for (let x=0; x<LAYER_WIDTH; x++) {
				if (val[y][x] == 2) {
					continue;
				}
				acc[y][x] = val[y][x];
			}
		}
		return acc;
	}, null).map(val => {
		return val.join("")
			.replace(/2/g, " ") // Transparent (there shouldn't be any)
			.replace(/1/g, "#") // Black
			.replace(/0/g, " ") // White
	});
};