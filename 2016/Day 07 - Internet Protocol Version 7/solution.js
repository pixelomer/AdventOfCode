module.exports = (input, part) => {
	function hasTLSPattern(component) {
		for (let i=0; i<component.length-3; i++) {
			if (
				(component[i] != component[i+1]) &&
				(component[i] == component[i+3]) &&
				(component[i+1] == component[i+2])
			) {
				return true;
			}
		}
		return false;
	}

	function reverseSSLPatterns(component) {
		const patterns = [];
		for (let i=0; i<component.length-2; i++) {
			const first = component[i];
			const second = component[i+1];
			if ((first != second) && (first == component[i+2])) {
				patterns.push(second + first + second);
			}
		}
		return patterns;
	}

	input = input.split("\n");

	let supporting = 0;
	for (const ip of input) {
		const hypernet = ip.match(/\[([a-z]+)\]/g).map((a) => a.match(/[a-z]+/)[0]);
		const supernet = ip.match(/\]([a-z]+)\[?|\]?([a-z]+)\[/g).map((a) => a.match(/[a-z]+/)[0]);
		let supports = false;
		if (part === 1) {
			for (const component of supernet) {
				if (hasTLSPattern(component)) {
					supports = true;
					break;
				}
			}
			if (!supports) continue;
			for (const component of hypernet) {
				if (hasTLSPattern(component)) {
					supports = false;
					break;
				}
			}
			if (supports) supporting++;
		}
		else {
			const patterns = [];
			for (const component of supernet) {
				patterns.push(...reverseSSLPatterns(component));
			}
			for (const pattern of patterns) {
				if (supports) break;
				for (const component of hypernet) {
					if (component.includes(pattern)) {
						supporting++;
						supports = true;
						break;
					}
				}
			}
		}
	}
	return supporting;
};