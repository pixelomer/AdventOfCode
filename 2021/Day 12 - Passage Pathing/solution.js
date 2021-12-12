module.exports = (input, part, isTest) => {
	input = input.split("\n").reduce((obj, line) => {
		const [,from,to] = line.match(/([^\-]+)-([^\-]+)/);
		obj[from] = obj[from] ?? [];
		obj[to] = obj[to] ?? [];
		obj[from].push(to);
		obj[to].push(from);
		return obj;
	}, {});
	
	function advance(path, didVisitException = false) {
		const current = path[path.length-1];
		if (current === "end") {
			return 1;
		}
		const possible = input[current] ?? [];
		let distinctPaths = 0;
		for (const next of possible) {
			let isException = false;
			if (["start","end"].includes(next) && path.includes(next)) {
				continue;
			}
			else if ((next.toLowerCase() === next) && path.includes(next)) {
				if (!didVisitException) {
					isException = true;
				}
				else {
					continue;
				}
			}
			const newPath = [...path, next];
			distinctPaths += advance(newPath, didVisitException || isException);
		}
		return distinctPaths;
	}
	
	return advance(["start"], (part === 1) ? true : false);
};