module.exports = (input, part) => {
	function convertToBinary(dec) {
		return (dec >>> 0).toString(2);
	}
	
	function applyMask_v1(num, mask) {
		mask = mask.padStart(36, "X");
		let numArray = convertToBinary(num).padStart(36, "0").split("");
		for (let i=35; i>=0; i--) {
			if (mask[i] != "X") {
				numArray[i] = mask[i];
			}
		}
		return parseInt(numArray.join(""), 2);
	}

	function applyMask_v2(num, mask) {
		mask = mask.padStart(36, "X");
		let numArray = convertToBinary(num).padStart(36, "0").split("");
		const possibilities = new Array();
		for (let i=35; i>=0; i--) {
			if (mask[i] == "1") {
				numArray[i] = mask[i];
			}
		}
		console.log(mask);
		console.log(numArray.join(""));
		const floatingCount = mask.match(/X/g).length;
		for (let i=0; i<(1 << floatingCount); i++) {
			let newMask = convertToBinary(i).padStart(36, "0");
			for (let j=35,k=35; j>=0; j--) {
				if (mask[j] === "X") {
					numArray[j] = newMask[k--];
				}
			}
			possibilities.push(parseInt(numArray.join(""), 2));
		}
		return possibilities;
	}

	const lines = input.split("\n");
	const mem = {};
	let mask = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
	lines.forEach((line)=>{
		console.log(line);
		if (line.startsWith("mask = ")) {
			mask = line.substr(7);
		}
		else if (line.startsWith("mem[")) {
			const match = line.match(/^mem\[([0-9]+)\] = ([0-9]+)$/);
			const address = parseInt(match[1]);
			if (part === 1) {
				const maskedValue = applyMask_v1(parseInt(match[2]), mask);
				console.log(maskedValue);
				mem[address] = maskedValue;
			}
			else if (part === 2) {
				applyMask_v2(address, mask).forEach((address)=>{
					mem[address] = parseInt(match[2]);
				});
			}
		}
	});
	return Object.values(mem).reduce((x,y) => x + y);
};