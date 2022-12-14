/** @type { (input: string, part: number, isTest: boolean) => any } */
module.exports = (input, part, isTest) => {
	const map = new Set();
	const get = (x, y) => map.has(`${x},${y}`);
	const set = (x, y) => map.add(`${x},${y}`);
	let lowestY = Number.MIN_SAFE_INTEGER;
	for (const line of input.split("\n")) {
		let x, y;
		for (const part of line.split(" -> ")) {
			const [_,nx,ny] = [...part.match(/(\d+),(\d+)/)].map((a) => +a);
			lowestY = Math.max(ny, lowestY);
			if (x != null) {
				let ax = Math.min(x, nx);
				let bx = Math.max(x, nx);
				let ay = Math.min(y, ny);
				let by = Math.max(y, ny);
				for (let mx=ax; mx<=bx; mx++) {
					for (let my=ay; my<=by; my++) {
						set(mx, my);
					}
				}
			}
			x = nx, y = ny;
		}
	}
	let units = 0;
	simulation: while (true) {
		let x = 500;
		let y = 0;
		if (get(x, y)) break;
		while (true) {
			if (part === 2) {
				if (y == (lowestY + 1)) {
					set(x,y);
					break;
				}
			}
			else {
				if (y > lowestY) {
					break simulation;
				}
			}
			if (!get(x, y+1)) {
				y += 1;
			}
			else if (!get(x-1, y+1)) {
				x -= 1;
				y += 1;
			}
			else if (!get(x+1, y+1)) {
				x += 1;
				y += 1;
			}
			else {
				set(x, y);
				break;
			}
		}
		units++;
	}
	return units;
};