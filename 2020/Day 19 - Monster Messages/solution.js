module.exports = (input, part) => {
	const split = input.split("\n\n");
	const rules = {};
	split[0].split("\n").forEach(value => {
		const split = value.split(": ");
		rules[parseInt(split[0])] = {
			raw: split.slice(1).join(": "),
			regex: null,
			looping: false
		};
	});
	const messages = split[1].split("\n");

	function buildRegex(ruleID) {
		let ruleObject = rules[ruleID];
		if (ruleObject.regex != null) {
			return ruleObject.regex;
		}
		let regex = "(?:";
		if (ruleObject.raw.startsWith('"') && ruleObject.raw.endsWith('"')) {
			regex += ruleObject.raw.slice(1, -1);
		}
		else {
			const possibleSubrules = ruleObject.raw.split(" | ");
			regex += "(?:";
			possibleSubrules.forEach((item, index)=>{
				const orderedSubrules = item.split(" ");
				if (index != 0) {
					regex += "|";
				}
				regex += "(?:";
				orderedSubrules.forEach((item, index)=>{
					regex += buildRegex(parseInt(item));
				});
				regex += ")";
			});
			regex += ")";
		}
		regex += ")";
		if (ruleObject.looping) {
			regex += "+";
		}
		ruleObject.regex = regex;
		return regex;
	}

	if (part === 2) {
		rules[8].regex = `${buildRegex(42)}+`;
		rules[8].looping = true;
		buildRegex(31);
		let rule11Regex = "(?:";

		// This is a very hacky solution and it'll only work if N <= max in
		//   (rule42){N}(rule31){N}
		// I didn't want to rewrite my code so I did it this way.
		// Now that I think about it, rewriting the code might've been a better idea.
		const max = 10;
		for (let i=1; i<=max; i++) {
			rule11Regex += `(?:${rules[42].regex}{${i}}${rules[31].regex}{${i}})`;
			if (i != max) {
				rule11Regex += "|";
			}
		}

		rules[11].regex = rule11Regex + ")";
		rules[11].looping = true;
	}

	const regex = new RegExp(`^${buildRegex(0)}$`, "g");
	let sum = 0;
	messages.forEach((message)=>{
		if (message.match(regex) != null) {
			sum++;
		}
	});

	return sum;
};