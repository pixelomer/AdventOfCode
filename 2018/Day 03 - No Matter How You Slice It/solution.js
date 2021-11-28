module.exports = (input, part) => {
	const area = {};
	const claims = input.split('\n').map((val) => {
		const parsed = val.match(/#([0-9]+) @ ([0-9]+),([0-9]+): ([0-9]+)x([0-9]+)/);
		return {
			id: +parsed[1],
			x: +parsed[2],
			y: +parsed[3],
			w: +parsed[4],
			h: +parsed[5]
		};
	});
	for (const {w, h, x, y} of claims) {
		for (let i=0; i<w; i++) {
			for (let j=0; j<h; j++) {
				const key = `${x+i},${y+j}`;
				area[key] = area[key] == null ? 0 : 1;
			}
		}
	}
	if (part === 2) {
		for (const {id, w, h, x, y} of claims) {
			let yes = true;
			for (let i=0; i<w; i++) {
				for (let j=0; j<h; j++) {
					const key = `${x+i},${y+j}`;
					if (area[key] === 1) {
						yes = false;
					}
				}
			}
			if (yes === true) {
				return id;
			}
		}
		return null;
	}
	return Object.values(area).reduce((prev, curr) => prev + curr, 0);
};