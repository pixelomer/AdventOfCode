module.exports = (input, part, isTest) => {
	let [paper,instructions] = input.split("\n\n").map((a) => a.split("\n"));
	paper = paper.map((a) => {
		const [,x,y] = a.match(/([0-9]+),([0-9]+)/);
		return [+x,+y];
	});
	for (const instruction of instructions) {
		const [,axis,pos] = instruction.match(/along ([xy])\=([0-9]+)/);
		const idx = (axis === "x") ? 0 : 1;
		paper = paper.map((a) => {
			if (a[idx] > +pos) {
				a[idx] -= (a[idx] - +pos) * 2;
			}
			return a;
		});
		if (part === 1) break;
	}
	if (part === 1) {
		return new Set(paper.map((a) => `${a[0]},${a[1]}`)).size;
	}
	paper = paper.filter((a) => (a[0] >= 0) && (a[1] >= 0));
	const positions = Array.from(new Set(paper.map((a) => `${a[0]},${a[1]}`))).map((a) => a.split(",").map((a) => +a));
	const result = [];
	for (const point of positions) {
		const yAxis = result[point[1]] ?? (result[point[1]] = []);
		for (let x=0; x<point[0]; x++) {
			yAxis[x] = yAxis[x] ?? " ";
		}
		yAxis[point[0]] = "#";
	}
	console.log("Cannot decode this programmatically, you are on your own here");
	console.log("\n" + result.map((a) => a.map((a) => a??" ").join("")).join("\n"));
	return null;
};