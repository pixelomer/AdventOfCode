module.exports = (input, part) => {
	function solve(math) {
		if (part === 2) {
			if (math.includes("*") !== math.includes("+")) {
				return eval(math);
			}
		}

		// Find and solve parentheses first
		while (math.indexOf("(") !== -1) {
			const absoluteStartIndex = math.indexOf("(");
			const substr = math.substr(absoluteStartIndex + 1);
			let counter = 0;
			let len;
			for (len=0; len<substr.length; len++) {
				if (substr[len] == "(") counter++;
				else if (substr[len] == ")") counter--;
				if (counter < 0) break;
			}
			const evaluated = solve(substr.substr(0, len));
			math = math.substr(0, absoluteStartIndex)
				+ evaluated.toString()
				+ math.substr(absoluteStartIndex+len+2);
		}

		// Solve
		let answer = 0;
		if (part === 1) {
			math.match(/(?:([*+])\ )?([0-9]+)/g).forEach((match)=>{
				match = match.match(/(?:([*+])\ )?([0-9]+)/);
				match[1] = match[1] ?? "+";
				match[2] = parseInt(match[2]);
				switch (match[1]) {
					case "+": answer += match[2]; break;
					case "*": answer *= match[2]; break;
				}
			});
		}
		else if (part === 2) {
			// It's gotta work if you replace enough... right?
			math = math.replace(/([0-9]+) \+ ([0-9]+)/g, "($&)");
			answer = solve(math);
		}

		//console.log(math, "=", answer);

		return answer;
	}

	const operations = input.split("\n");
	let sum = 0;
	operations.forEach((operation)=>{
		sum += solve(operation);
	});

	return sum;
};