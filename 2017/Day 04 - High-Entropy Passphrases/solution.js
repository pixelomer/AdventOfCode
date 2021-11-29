module.exports = (input, part) => {
	const lines = input.split("\n");
	let valid = 0;
	if (part === 1) {
		for (const line of lines) {
			const comps = line.split(' ');
			if (comps.length == new Set(comps).size) {
				valid++;
			}
		}
	}
	else {
		for (let i=0; i<lines.length; i++) {
			const line = lines[i].split(' ');
			let pass = true;
			for (let j=0; j<line.length; j++) {
				for (let k=j+1; k<line.length; k++) {
					const pass1 = line[j].split("").sort((a,b) => a.charCodeAt(0) - b.charCodeAt(0)).join("");
					const pass2 = line[k].split("").sort((a,b) => a.charCodeAt(0) - b.charCodeAt(0)).join("");
					if (pass1 === pass2) {
						pass = false;
						k = j = line.length;
					}
				}
			}
			if (pass) {
				valid++;
			}
		}
	}
	return valid;
};