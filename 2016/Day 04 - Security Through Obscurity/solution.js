module.exports = (input, part) => {
	input = input.split("\n");
	let sum = 0;

	function decrypt(name, rotation) {
		const codeForA = "a".charCodeAt(0);
		const max = "z".charCodeAt(0) - codeForA + 1;
		const encrypted = name.split("");
		for (let i=0; i<encrypted.length; i++) {
			if (encrypted[i] === "-") {
				encrypted[i] = " ";
				continue;
			}
			const charCode = encrypted[i].charCodeAt(0);
			const newCharCode = codeForA + ((charCode - codeForA + rotation) % max);
			encrypted[i] = String.fromCharCode(newCharCode);
		}
		const decrypted = encrypted.join("");
		return decrypted;
	}

	for (let i=0; i<input.length; i++) {
		const [ , roomID, sector, checksum ] = input[i].match(/^([^0-9]+?)([0-9]+)\[([a-z]+)\]$/);
		const roomLetters = roomID.match(/[a-z]/g);
		const grouped = {};
		for (const letter of roomLetters) {
			grouped[letter] = (grouped[letter] ?? 0) + 1;
		}
		const expectedChecksum = Object.entries(grouped).sort((a, b) => {
			return (b[1] - a[1]) || (a[0] > b[0] ? 1 : -1);
		}).slice(0, 5).map((a) => a[0]).join("");
		if (expectedChecksum === checksum) {
			if (part === 2) {
				const roomName = decrypt(roomID, +sector);
				if (roomName.includes("north")) {
					return +sector;
				}
			}
			sum += +sector;
		}
	}
	if (part === 1) {
		return sum;
	}
};