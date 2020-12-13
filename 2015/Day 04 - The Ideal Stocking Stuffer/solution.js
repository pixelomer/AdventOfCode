const crypto = require("crypto");

module.exports = (input, part) => {
	let hash = "";
	let i = 0;
	const targetPrefix = "00000" + ((part === 2) ? "0" : "");
	while (!hash.startsWith(targetPrefix)) {
		const str = input + i++;
		hash = crypto.createHash("md5").update(str).digest("hex");
		//console.error(`"${(str+"\" ").padEnd(20, "=")}=> ${hash}`);
	}
	return i-1;
};