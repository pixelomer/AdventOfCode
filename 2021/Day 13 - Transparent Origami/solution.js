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
	const uniquePoints = new Set(paper.map((a) => `${a[0]},${a[1]}`));
	if (part === 1) {
		return uniquePoints.size;
	}
	paper = paper.filter((a) => (a[0] >= 0) && (a[1] >= 0));
	const result = [];
	for (const point of uniquePoints) {
		const [x,y] = point.split(",");
		const yAxis = result[+y] ?? (result[+y] = []);
		for (let sx=yAxis.length; sx<x; sx++) {
			yAxis[sx] = yAxis[sx] ?? " ";
		}
		yAxis[x] = "#";
	}
	console.log("Cannot decode this programmatically, you are on your own here");
	console.log("\n" + result.map((a) => a.map((a) => a??" ").join("")).join("\n"));
	return null;
};