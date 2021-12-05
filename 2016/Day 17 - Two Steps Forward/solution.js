const crypto = require('crypto');

module.exports = (input, part) => {
	const maze =
`#########
#S| | | #
#-#-#-#-#
# | | | #
#-#-#-#-#
# | | | #
#-#-#-#-#
# | | |  
####### V`.split("\n");
	const get = (x,y) => maze[y][x];

	function findPath(x, y, path) {
		const hash = crypto.createHash('md5').update(input + path).digest('hex');
		const [up,down,left,right] = hash.slice(0,4).split("").map((a) => (a > "a") ? true : false);
		if (get(x+1, y) == " ") {
			return { shortest: path, longest: path };
		}
		const directions = [];
		if (up && (get(x, y-1) == '-')) {
			directions.push([x, y-2, path + "U"]);
		}
		if (right && (get(x+1, y) == '|')) {
			directions.push([x+2, y, path + "R"]);
		}
		if (down && (get(x, y+1) == '-')) {
			directions.push([x, y+2, path + "D"]);
		}
		if (left && (get(x-1, y) == '|')) {
			directions.push([x-2, y, path + "L"]);
		}
		let shortest = null;
		let longest = null;
		for (const direction of directions) {
			const path = findPath(...direction);
			if (path == null) {
				continue;
			}
			if ((shortest == null) || (path.shortest.length < shortest.length)) {
				shortest = path.shortest;
			}
			if ((longest == null) || (path.longest.length > longest.length)) {
				longest = path.longest;
			}
		}
		return (shortest != null) ? { shortest, longest } : null;
	}

	const path = findPath(1, 1, "");
	if (part === 1) {
		return path.shortest;
	}
	else {
		return path.longest.length;
	}
};