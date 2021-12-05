const Jimp = require('jimp');

/** @returns {Promise<Jimp>} */
function createImage(width, height) {
	return new Promise((resolve, reject) => {
		new Jimp(width, height, (err, image) => {
			if (err != null) reject(err);
			else resolve(image);
		});
	});
}

module.exports = async(input, part, isTest) => {
	input = input.split("\n");
	const points = {};
	let maxX = 0, maxY = 0, maxOverlap = 0;
	for (const line of input) {
		let [,x1,y1,x2,y2] = line.match(/([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)/);
		if ((part === 1) && (x1 != x2) && (y1 != y2)) {
			continue;
		}
		let [getX,getY] = [[x1,x2], [y1,y2]].map(([x1,x2]) => {
			let current = +x1;
			let target = +x2;
			let add = +1;
			if (current > +x2) {
				add = -1;
			}
			return () => {
				const val = current;
				if (val != target) {
					current += add;
				}
				return val;
			};
		});
		let x, y;
		let prevKey = null;
		while (true) {
			x = getX(), y = getY();
			maxX = Math.max(x, maxX);
			maxY = Math.max(y, maxY);
			const key = `${x},${y}`;
			if (key == prevKey) break;
			prevKey = key;
			points[key] = (points[key] ?? 0) + 1;
			maxOverlap = Math.max(points[key], maxOverlap)
		}
	}
	
	// Visualization
	if (!isTest) {
		const image = await createImage(maxX+1, maxY+1);
		for (let x=0; x<maxX; x++) {
			for (let y=0; y<maxY; y++) {
				const key = `${x},${y}`;
				const overlap = points[key] ?? 0;
				let brightness = Math.floor((overlap / maxOverlap) * 0xFF);
				const hex = ((brightness << 24) | (brightness << 16) | (brightness << 8) | 0xFF) >>> 0;
				image.setPixelColor(hex, x, y);
			}
		}
		await image.writeAsync(`part${part}.png`);
	}

	const overlap = Object.values(points).filter((a) => a > 1).length;
	return overlap;
};