/** @type { (input: string, part: number, isTest: boolean) => any } */
module.exports = (input, part, isTest) => {
	input = input.split("\n").map((a) => a.split("").map((a) => +a));
	let score = 0;
	let visibleCount = 0;
	for (let x=0; x<input.length; x++) {
		for (let y=0; y<input[x].length; y++) {
			let sums = [];
			let visible = false;
			const t = +input[x][y];
			for (const [dx,dy] of [[0,1],[0,-1],[-1,0],[1,0]]) {
				let count = 0;
				for (let nx=x+dx, ny=y+dy; ; nx+=dx, ny+=dy)
				{
					if (input[nx]?.[ny] == null) {
						visible = true;
						break;
					}
					count++;
					if (+input[nx][ny] >= t) break;
				}
				sums.push(count);
			}
			if (visible) visibleCount++;
			score = Math.max(score, sums.reduce((a,b) => a*b, 1));
		}
	}
	if (part === 1) {
		return visibleCount;
	}
	else {
		return score;
	}
};