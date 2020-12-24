const v8 = require("v8");

const BLACK = 1;
const WHITE = 0;

module.exports = (input, part) => {
	const split = input.split("\n");

	const _tiles = new Map();
	let minX = 0;
	let maxX = 0;
	let minY = 0;
	let maxY = 0;

	function getColor(x, y, tiles = _tiles) {
		map1 = tiles.get(x);
		if (map1 == null) return WHITE;
		return (map1.get(y) ?? WHITE);
	}

	function countBlackTiles() {
		return Array.from(_tiles.values()).reduce(((acc, val) => acc + Array.from(val.values()).reduce(((acc, val) => acc + val), 0)), 0);
	}

	function setColor(x, y, color, tiles = _tiles) {
		map1 = tiles.get(x);
		if (map1 == null) {
			map1 = new Map();
			tiles.set(x, map1);
		}
		map1.set(y, color);
	}

	split.forEach((location) => {
		let x = 0;
		let y = 0;
		while (location.length) {
			const offsets = {
				sw: { x:-1, y:-1 },
				se: { x:1, y:-1 },
				nw: { x:-1, y:1 },
				ne: { x:1, y:1 },
				n: { x:0, y:1 },
				s: { x:0, y:-1 },
				e: { x:2, y:0 },
				w: { x:-2, y:0 }
			};
			let length = 2;
			let substr = location.substr(0, length);
			let offset = offsets[substr];
			if (offset == null) {
				length = 1;
				substr = location.substr(0, length);
				offset = offsets[substr];
			}
			x += offset.x;
			y += offset.y;
			location = location.substr(length);
		}
		maxX = Math.max(maxX, x);
		minX = Math.min(minX, x);
		maxY = Math.max(maxY, y);
		minY = Math.min(minY, y);
		setColor(x, y, +!getColor(x, y));
	});

	if (part === 2) {
		for (let i=0; i<100; i++) {
			const oldTiles = v8.deserialize(v8.serialize(_tiles));
			minX-=2; minY-=1; maxX+=2; maxY+=1;
			for (let x=minX; x<=maxX; x++) {
				for (let y=minY; y<=maxY; y++) {
					const blackTileCount = (
						getColor(x-2, y, oldTiles)
						+ getColor(x+2, y, oldTiles)
						+ getColor(x-1, y+1, oldTiles)
						+ getColor(x-1, y-1, oldTiles)
						+ getColor(x+1, y+1, oldTiles)
						+ getColor(x+1, y-1, oldTiles)
					);
					if ((blackTileCount == 0) || (blackTileCount > 2)) {
						setColor(x, y, WHITE);
					}
					else if (blackTileCount == 2) {
						setColor(x, y, BLACK);
					}
				}
			}
			//console.log(`Day ${i+1}: ${countBlackTiles()}`);
		}
	}

	return countBlackTiles();
};