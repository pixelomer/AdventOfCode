function findTreeCount(map, right, down) {
	let treeCount = 0;
	for (let x=0, y=0; (y < map.length); x += right, y += down) {
		if (map[y][x % map[y].length] === "#") {
			treeCount++;
		}
	}
	return treeCount;
}

module.exports = (input, part) => {
	const map = input.split("\n");
	if (part === 1) {
		return findTreeCount(map, 3, 1);
	}
	else if (part === 2) {
		let result = 1;
		const slopes = [[1,1], [3,1], [5,1], [7,1], [1,2]];
		slopes.forEach((slope)=>{
			result *= findTreeCount(map, slope[0], slope[1]);
		});
		return result;
	}
	return null;
};