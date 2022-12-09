/** @type { (input: string, part: number, isTest: boolean) => any } */
module.exports = (input, part, isTest) => {
	const DIRECTIONS = {
		U: { x:0, y:-1 },
		D: { x:0, y:1 },
		L: { x:-1, y:0 },
		R: { x:1, y:0 }
	};

	/** @type { { x: number, y: number }[] } */
	const parts = [];

	for (let i=0; i < ((part === 2) ? 10 : 2); i++) {
		parts.push({ x:0, y:0 });
	}

	const tail = new Set();

	for (const line of input.split("\n")) {
		let [direction, amount] = line.split(" ");
		amount = +amount;
		for (let c=0; c<amount; c++) {
			for (let i=0; i<parts.length; i++) {
				const curr = parts[i];
				const head = parts[i-1];
				if (head != null) {
					const cx = curr.x - head.x;
					const cy = curr.y - head.y;
					const dx = Math.abs(cx);
					const dy = Math.abs(cy);
					if (dx > 1 || dy > 1) {
						if (dx > dy) {
							curr.x = head.x + ((cx > 0) ? 1 : -1);
							curr.y = head.y;
						}
						else if (dx < dy) {
							curr.x = head.x;
							curr.y = head.y + ((cy > 0) ? 1 : -1);
						}
						else {
							curr.y = head.y + ((cy > 0) ? 1 : -1);
							curr.x = head.x + ((cx > 0) ? 1 : -1);
						}
					}
				}
				else {
					const { x, y } = DIRECTIONS[direction];
					curr.x += x;
					curr.y += y;
				}
			}
			const tailPart = parts[parts.length-1];
			tail.add(`${tailPart.x},${tailPart.y}`);
		}
	}

	return tail.size;
};