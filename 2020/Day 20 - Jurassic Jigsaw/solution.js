const LEFT = 0;
const TOP = 1;
const RIGHT = 2;
const BOTTOM = 3;

const TOP_LEFT = 0;
const TOP_RIGHT = 1;
const BOTTOM_LEFT = 2;
const BOTTOM_RIGHT = 3;

function boolArrayToString(array) {
	return array.reduce(((acc, val) => acc += (val ? "#" : ".")), "");
}

function flip(array) {
	const isString = String.isString(array);
	if (isString) {
		array = array.split("\n");
	}
	let result = array.map((item) =>
		isString
		? item.split("").reverse().join("")
		: item.reverse()
	);
	if (isString) {
		result = result.join("\n");
	}
	return result;
}

function rotateLeft(array) {
	const isString = String.isString(array);
	if (isString) {
		array = array.split("\n").map((item) => item.split(""));
	}
	newContents = [];
	for (let j=0; j<array[0].length; j++) {
		newContents.push(array.reduce((acc, val) => {
			acc.push(val[val.length-j-1]);
			return acc;
		}, []));
	}
	if (isString) {
		newContents = newContents.map((item) => item.join("")).join("\n");
	}
	return newContents;
}

class WorldMapCoordinates {
	x = 0;
	y = 0;

	constructor(x, y) {
		if (!Number.isInteger(x) || !Number.isInteger(y)) {
			throw new Error(`X and Y coordinates must be integers. Got {${x},${y}} instead.`);
		}
		this.x = x;
		this.y = y;
	}

	toString() {
		return `${this.x},${this.y}`;
	}

	static from(string) {
		const split = string.split(",").map((val) => parseInt(val));
		return new WorldMapCoordinates(split[0], split[1]);
	}

	copy() {
		const newCoords = new WorldMapCoordinates(this.x, this.y);
		return newCoords;
	}
}

class WorldMapTile {
	location = null;
	contents = null;
	edges = null;
	ID = null;

	getSide(side) {
		switch (side) {
			case BOTTOM: return this.contents[this.contents.length-1];
			case TOP: return this.contents[0];
			case LEFT:
				return this.contents.reduce((acc, val) => {
					acc.push(val[0]);
					return acc;
				}, []);
			case RIGHT:
				return this.contents.reduce((acc, val) => {
					acc.push(val[val.length-1]);
					return acc;
				}, []);
		}
	}

	matchesWithTile(edge, tile) {
		const val1 = boolArrayToString(this.getSide(edge));
		const val2 = boolArrayToString(tile.getSide((edge + 2) % 4));
		return (val1 === val2);
	}

	flip() {
		this.contents = flip(this.contents);
	}

	rotateLeft() {
		this.contents = rotateLeft(this.contents);
	}

	constructor(inputData) {
		if (inputData != null) {
			this.contents = inputData.map((val) => val.split("").map((val) => (val == "#") ? true : false));
		}
	}
}

class WorldMap {
	tiles = {};

	_update(location, key, x, y) {
		location.x = x(this.tiles[key].location.x, location.x);
		location.y = y(this.tiles[key].location.y, location.y);
	}

	getEdges() {
		const topLeft = new WorldMapCoordinates(0, 0);
		const topRight = topLeft.copy();
		const bottomLeft = topLeft.copy();
		const bottomRight = topLeft.copy();
		Object.keys(this.tiles).forEach((key) => {
			this._update(topLeft, key, Math.min, Math.min);
			this._update(topRight, key, Math.max, Math.min);
			this._update(bottomLeft, key, Math.min, Math.max);
			this._update(bottomRight, key, Math.max, Math.max);
		});
		return {
			[TOP_LEFT]: topLeft,
			[TOP_RIGHT]: topRight,
			[BOTTOM_LEFT]: bottomLeft,
			[BOTTOM_RIGHT]: bottomRight,
		}
	}

	toString() {
		const edges = this.getEdges();
		let string = "";
		let array = [];
		while (edges[TOP_LEFT].y <= edges[BOTTOM_LEFT].y) {
			for (let x=edges[TOP_LEFT].x; x<=edges[TOP_RIGHT].x; x++) {
				const tile = this.tileAtLocation(new WorldMapCoordinates(x, edges[TOP_LEFT].y));
				const contents = tile.contents.map((val) => boolArrayToString(val));
				contents.forEach((value, index) => {
					if ((index == 0) || (index == contents.length-1)) return;
					index -= 1;
					value = value.substr(1, value.length-2);
					if (array.length <= index) {
						array.push(value);
					}
					else {
						array[index] += value;
					}
				});
			}
			string += array.join("\n") + "\n";
			array = [];
			edges[TOP_LEFT].y++;
		}
		return string.substr(0, string.length-1);
	}

	tileAtLocation(location) {
		return this.tiles[location.toString()];
	}

	tryPlace(newTile) {
		if (newTile.location == null) return false;
		if (this.tileAtLocation(newTile.location) != null) return false;
		const offsets = {
			[LEFT]: new WorldMapCoordinates(-1, 0),
			[TOP]: new WorldMapCoordinates(0, -1),
			[RIGHT]: new WorldMapCoordinates(1, 0),
			[BOTTOM]: new WorldMapCoordinates(0, 1)
		};
		for (let flipped=0; flipped<=1; flipped++) {
			for (let rotation=0; rotation<4; rotation++) {
				let side;
				for (side=0; side<4; side++) {
					const neighbourLocation = newTile.location.copy();
					neighbourLocation.x += offsets[side].x;
					neighbourLocation.y += offsets[side].y;
					const neighbourTile = this.tileAtLocation(neighbourLocation);
					if ((neighbourTile != null) && !newTile.matchesWithTile(side, neighbourTile)) {
						side = 5;
						break;
					}
				}
				if (side == 4) {
					// All checks passed!
					this.tiles[newTile.location.toString()] = newTile;
					return true;
				}
				newTile.rotateLeft();
			}
			newTile.flip();
		}
	}

	constructor(initialTile) {
		if (initialTile.location == null) {
			initialTile.location = new WorldMapCoordinates(0,0);
		}
		else if (initialTile.location.toString() != "0,0") {
			console.warn("Initial tile for map didn't have the coordinates \"0,0\".");
		}
		this.tiles[initialTile.location.toString()] = initialTile;
	}
}

module.exports = (input, part) => {
	const tiles = input.split("\n\n").map((val) => {
		const split = val.split("\n");
		const tile = new WorldMapTile(split.slice(1));
		tile.ID = parseInt(split[0].substr(5));
		return tile;
	});
	let map = new WorldMap(tiles.splice(0,1)[0]);
	const location = new WorldMapCoordinates(0, -1);
	let increment = -1;
	let maxY = 0;
	let minY = 0;
	while (true) {
		const oldValue = location.y;
		for (let i=tiles.length-1; i>=0; i--) {
			tiles[i].location = location.copy();
			if (map.tryPlace(tiles[i])) {
				tiles.splice(i, 1);
				location.y += increment;
			}
		}
		if (oldValue == location.y) {
			if (increment == -1) {
				minY = location.y + 1;
				location.y = increment = 1;
			}
			else {
				maxY = location.y - 1;
				break;
			}
		}
	}
	for (let y=minY; y<=maxY; y++) {
		location.x = -1;
		location.y = y;
		increment = -1;
		while (true) {
			const oldValue = location.x;
			for (let i=tiles.length-1; i>=0; i--) {
				tiles[i].location = location.copy();
				if (map.tryPlace(tiles[i])) {
					tiles.splice(i, 1);
					location.x += increment;
				}
			}
			if (oldValue == location.x) {
				if (increment == -1) {
					minX = location.x + 1;
					location.x = increment = 1;
				}
				else {
					maxX = location.x - 1;
					break;
				}
			}
		}
	}
	if (tiles.length != 0) {
		console.log("There are still unplaced tiles.", tiles);
		return null;
	}
	if (part === 1) {
		const edges = map.getEdges();
		return (
			map.tileAtLocation(edges[TOP_LEFT]).ID
			* map.tileAtLocation(edges[TOP_RIGHT]).ID
			* map.tileAtLocation(edges[BOTTOM_LEFT]).ID
			* map.tileAtLocation(edges[BOTTOM_RIGHT]).ID
		);
	}
	else if (part === 2) {
		function findSeaMonsters(map) {
			const lines = map.split("\n");
			let monsterCount = 0;
			let didMatch = true;
			while (didMatch) {
				didMatch = false;
				for (let line=0; line<=lines.length-3; line++) {
					for (let start=0; start<=lines[line].length-20; start++) {
						if (lines[line][start+18] == "#") {
							//                   #
							// #    ##    ##    ###
							//  #  #  #  #  #  #   
							const regex1 = new RegExp(`^(.{${start}})#(.{4})##(.{4})##(.{4})###(.*)$`);
							const regex2 = new RegExp(`^(.{${start+1}})#(.{2})#(.{2})#(.{2})#(.{2})#(.{2})#(.*)$`);
							if (
								lines[line+1].match(regex1)
								&& lines[line+2].match(regex2)
							) {
								regex1.lastIndex = 0;
								regex2.lastIndex = 0;
								lines[line] = lines[line].substr(0, start+18) + "O" + lines[line].substr(start+19);
								lines[line+1] = lines[line+1].replace(regex1, "$1O$2OO$3OO$4OOO$5")
								lines[line+2] = lines[line+2].replace(regex2, "$1O$2O$3O$4O$5O$6O$7");
								didMatch = true;
								monsterCount++;
							}
						}
					}
				}
			}
			return {
				map: lines.join("\n"),
				monsterCount: monsterCount
			};
		}
		map = map.toString();
		for (let flipped=0; flipped<=1; flipped++) {
			for (let orientation=0; orientation<4; orientation++) {
				const findings = findSeaMonsters(map);
				if (findings.monsterCount > 0) {
					return findings.map.match(/#/g).length;
				}
				map = rotateLeft(map);
			}
			map = flip(map);
		}
	}
};