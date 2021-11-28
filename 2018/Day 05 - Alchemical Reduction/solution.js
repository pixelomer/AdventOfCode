module.exports = (input, part) => {
	function react(polymer) {
		polymer = polymer.split('');
		let prevCount;
		do {
			prevCount = polymer.length;
			for (let i=polymer.length - 1; i>=1; i--) {
				if ((polymer[i].toLowerCase() === polymer[i-1].toLowerCase()) && (polymer[i] !== polymer[i-1])) {
					polymer.splice(i-1, 2);
					i--;
				}
			}
		} while (prevCount !== polymer.length);
		return polymer.length;
	}
	if (part === 1) {
		return react(input);
	}
	else {
		const components = new Set(input.toLowerCase().split(''));
		let result = Number.MAX_SAFE_INTEGER;
		for (const component of components) {
			let newPolymer = input.replace(new RegExp(`[${component}${component.toUpperCase()}]`, 'g'), '');
			const reactionResult = react(newPolymer);
			if (reactionResult < result) {
				result = reactionResult;
			}
		}
		return result;
	}
}