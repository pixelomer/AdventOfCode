module.exports = (input, part) => {
	const UP=0, RIGHT=1, DOWN=2, LEFT=3;

	function getBorder(tile, borderID) {
		borderID %= 4;
		switch (borderID) {
			case UP:
				return tile[0];
			case DOWN:
				return tile[tile.length-1];
			case LEFT:
				return tile.reduce((border, line) => border += line[0], "");
			case RIGHT:
				return tile.reduce((border, line) => border += line[line.length-1], "");
		}
	}

	function rotate(tile) {
		const newTile = new Array(tile.length).fill("", 0, tile.length);
		for (let y=0; y<tile.length; y++) {
			const rotated = tile[y].split("").reverse();
			for (let x=0; x<tile[y].length; x++) {
				newTile[x] += rotated[x];
			}
		}
		return newTile;
	}

	function flip(tile) {
		const newTile = [];
		for (let i=0; i<tile.length; i++) {
			newTile[tile.length-i-1] = tile[i];
		}
		return newTile;
	}

	function trim(tile) {
		return tile.slice(1, tile.length-1).map((line) => line.slice(1, line.length-1));
	}

	const tiles = input.split("\n\n").map((desc) => {
		desc = desc.split("\n");
		const [tileID] = desc[0].match(/[0-9]+/g);
		return {
			id: +tileID,
			data: desc.slice(1)
		};
	});
	
	let map = [ [ tiles[0] ] ];
	tiles.splice(0,1);

	while (tiles.length !== 0) {
		tilesLoop:
		for (let i=0; i<tiles.length; i++) {
			const tile = tiles[i];
			// Get a tile on the map
			for (let y=0; y<map.length; y++) {
				for (let x=0; x<map[y].length; x++) {
					if (map[y][x] == null) continue;
					if (
						(map[y+1]?.[x] != null) &&
						(map[y]?.[x+1] != null) &&
						(map[y-1]?.[x] != null) &&
						(map[y]?.[x-1] != null)
					) continue;
					// Check borders
					for (let rotateCount=0; rotateCount<4; rotateCount++) {
						for (let flipCount=0; flipCount<2; flipCount++) {
							for (let border=0; border<4; border++) {
								if (getBorder(tile.data, border) === getBorder(map[y][x].data, border+2)) {
									switch (border) {
										case RIGHT:
											if (x === 0) {
												for (const line of map) line.splice(0, 0, null);
												x += 1;
											}
											map[y][x-1] = tile;
											break;
										case LEFT:
											map[y][x+1] = tile;
											break;
										case UP:
											if (y === 0) {
												map.splice(0, 0, map[0].map(() => null));
												y += 1;
											}
											map[y-1][x] = tile;
											break;
										case DOWN:
											if (y === map.length - 1) {
												map.push(map[0].map(() => null));
											}
											map[y+1][x] = tile;
											break;
									}
									tiles.splice(i, 1);
									i--;
									continue tilesLoop;
								}
							}
							tile.data = flip(tile.data);
						}
						tile.data = rotate(tile.data);
					}
				}
			}
		}
	}
	
	if (part === 1) {
		const width = map[0].length;
		const height = map.length;
		return (
			map[0][0].id *
			map[0][width - 1].id *
			map[height - 1][0].id *
			map[height - 1][width - 1].id 
		);
	}

	map = map.map((line) => 
		flip(line
			.map((tile) => trim(tile.data))
			.reduce((a, b) => (a == null) ? b : a.map((a,i) => a + b[i]), null)
		)
	).flat();

	let monsterCount = 0;

	rotateLoop:
	for (let rotateCount=0; rotateCount<4; rotateCount++) {
		for (let flipCount=0; flipCount<2; flipCount++) {
			for (let y=0; y<map.length-2; y++) {
				for (let x=0; x<map[y].length-18; x++) {
					if (map[y][x + 18] !== "#") continue;
					if (!map[y+1].slice(x).match(/^#....##....##....###/)) continue;
					if (!map[y+2].slice(x).match(/^.#..#..#..#..#..#.../)) continue;
					monsterCount++;
				}
			}
			if (monsterCount !== 0) {
				break rotateLoop;
			}
			map = flip(map);
		}
		map = rotate(map);
	}

	return map.join("").match(/#/g).length - monsterCount * 15;
};