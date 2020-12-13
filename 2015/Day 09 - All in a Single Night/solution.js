module.exports = (input, part) => {
	const inputArray = input.split("\n");
	const distances = new Map();
	const places = new Set();

	function set(from, to, distance) {
		if (distances[from] == null) {
			distances[from] = new Map();
		}
		distances[from][to] = distance;
		places.add(from);
		places.add(to);
	}

	inputArray.forEach((route) => {
		const match = route.match(/^([a-zA-Z]+) to ([a-zA-Z]+) = ([0-9]+)$/);
		const from = match[1];
		const to = match[2];
		const distance = parseInt(match[3]);
		set(from, to, distance);
		set(to, from, distance);
	});
	
	// UNSOLVED
	// - places is a set that contains all of the places
	// - distances[place1][place2] is the distance between place1 and place2
};