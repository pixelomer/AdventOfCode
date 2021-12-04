const crypto = require('crypto');

module.exports = (input, part) => {
	let password = [];
	let found = 0;

	function updateStatus() {
		const state = [...password];
		for (let i=0; i<8; i++) {
			state[i] = state[i] ?? "_";
		}
		process.stdout.write(`\rHACKING... [${state.join("")}]`);
	}

	updateStatus();

	for (let i=0; found < 8; i++) {
		const data = `${input}${i}`;
		const hash = crypto.createHash("md5").update(data).digest('hex');
		if (hash.startsWith("00000")) {
			if (part === 1) {
				password[found] = hash[5];
				found++;
			}
			else {
				const pos = parseInt(hash[5]);
				if (isNaN(pos) || (pos > 7) || (password[pos] != null)) {
					continue;
				}
				password[pos] = hash[6];
				found++;
			}
			updateStatus();
		}
	}
	
	process.stdout.write("\n");
	return password.join("");
};