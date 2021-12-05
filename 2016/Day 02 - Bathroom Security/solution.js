module.exports = (input, part) => {
	let password = "";
	let keypad, pos;
	if (part === 1) {
		keypad = [
			"123",
			"456",
			"789"
		];
		pos = { x:1, y:1 };
	}
	else {
		keypad = [
			"  1  ",
			" 234 ",
			"56789",
			" ABC ",
			"  D  "
		];
		pos = { x:0, y:2 };
	}
	for (const instructions of input.split("\n")) {
		for (let i=0; i<instructions.length; i++) {
			const direction = instructions[i];
			let change;
			switch (direction) {
				case "U": change = ["y", -1]; break;
				case "D": change = ["y", +1]; break;
				case "L": change = ["x", -1]; break;
				case "R": change = ["x", +1]; break;
			}
			pos[change[0]] += change[1];
			const newKey = keypad?.[pos.y]?.[pos.x];
			if ((newKey == null) || (newKey == ' ')) {
				pos[change[0]] -= change[1];
			}
		}
		password += keypad[pos.y][pos.x];
	}
	return password;
};