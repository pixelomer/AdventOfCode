// Returns true if a new house was added to the set.
// Otherwise returns false.
function advanceSanta(santa, direction) {
	switch (direction) {
		case '^': santa.y++; break;
		case 'v': santa.y--; break;
		case '>': santa.x++; break;
		case '<': santa.x--; break;
	}
	const position = `${santa.x},${santa.y}`;
	if (santa.houses.has(position)) {
		return false;
	}
	else {
		santa.houses.add(position);
		return true;
	}
}

// Houses is a global because every santa delivers gifts in the
// same 2D grid with the same center
var _houses = undefined;

function newSanta() {
	if (_houses === undefined) {
		// If the _houses variable isn't defined, a new Set is
		// initialized and assigned to it.
		_houses = new Set();
		_houses.add("0,0");
	}
	return { houses: _houses, x: 0, y: 0 };
}

module.exports = (input, part) => {
	// Initialize each santa
	const santaArray = new Array();
	for (let i=0; i<part; i++) {
		santaArray.push(newSanta());
	}

	// Santa starts at (0,0) and the first gift for that
	// house has already been delivered.
	let houseCount = 1;
	
	for (let i=0; i<input.length; i++) {
		const santa = santaArray[i % santaArray.length];
		if (advanceSanta(santa, input[i])) {
			houseCount++;
		}
	}
	return houseCount;
};