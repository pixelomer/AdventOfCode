module.exports = (input, part) => {
	const array = input.split("\n");
	let validCount = 0;
	if (array.some((item)=>{
		const match = item.match(/^([0-9]+)\-([0-9]+) ([a-z]): (.*)$/);
		if (!match) return true;
		const a = parseInt(match[1]);
		const b = parseInt(match[2]);
		const char = match[3];
		const password = match[4];
		if (part === 1) {
			const count = (password.match(new RegExp(char, "g")) ?? "").length;
			if ((count >= a) && (count <= b)) {
				validCount++;
			}
		}
		else if (part === 2) {
			if ((password[a-1] === char) ^ (password[b-1] === char)) {
				validCount++;
			}
		}
		return false;
	})) return null;
	return validCount;
};