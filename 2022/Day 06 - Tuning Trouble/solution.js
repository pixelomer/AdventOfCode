module.exports = (input, part, isTest) => {
	const len = (part === 2) ? 14 : 4;
	for (let i=0; i<input.length - len; i++) {
		const p = input.slice(i, i+len);
		if (new Set(p.split("")).size === len) return i + len;
	}
};