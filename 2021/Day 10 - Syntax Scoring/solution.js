module.exports = (input, part, isTest) => {
	input = input.split("\n");
	const scores = [];
	for (let j=input.length-1; j>=0; j--) {
		const line = input[j];
		const chars = [];
		let corrupted = false;
		for (let i=0; i<line.length; i++) {
			let key = line[i];
			if ([")","]","}",">"].includes(key)) {
				const expected = {")":"(", "]":"[", "}":"{", ">":"<"}[key];
				if (expected !== chars.pop()) {
					if (part === 1) {
						scores.push({")":3, "]":57, "}":1197, ">":25137}[key]);
					}
					corrupted = true;
					break;
				}
			}
			else {
				chars.push(key);
			}
		}
		if (!corrupted && (part === 2)) {
			scores.push(chars.reverse().map((a) => ({"(":1, "[":2, "{":3, "<":4}[a])).reduce((a,b)=>(a*5)+b,0));
		}
	}
	if (part === 1) {
		return scores.reduce((a,b)=>a+b,0);
	}
	else {
		return scores.sort((a,b)=>a-b)[Math.floor(scores.length / 2)];
	}
};