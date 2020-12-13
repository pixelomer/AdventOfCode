// Personal stats:
// [Part 1] 00:12:22, #326
// [Part 2] 00:17:11, #216

module.exports = (input, part) => {
	const definitions = input.split("\n");
	const bags = {};
	definitions.forEach((definition)=>{
		const split = definition.split(" contain ");
		const matches = split[1].match(/[0-9]+ [a-z ]+[.,]/g);
		if (split[0].endsWith("s")) split[0] = split[0].substr(0, split[0].length - 1);
		bags[split[0]] = [];
		if (split[1] == "no other bags.") {
			return;
		}
		matches.forEach((match)=>{
			const subMatch = match.match(/^([0-9]+) ([a-z ]+)[,.]$/);
			if (subMatch[2].endsWith("s")) subMatch[2] = subMatch[2].substr(0, subMatch[2].length - 1);
			bags[split[0]].push({
				name: subMatch[2],
				count: parseInt(subMatch[1])
			});
		});
	});
	
	function doesContainShinyGold(bag) {
		return Object.values(bag).some((obj)=>{
			if (obj.name === "shiny gold bag") return true;
			return doesContainShinyGold(bags[obj.name]);
		});
	}

	function numberOfBagsInsideBag(bag) {
		let count = 0;
		bag.forEach((obj)=>{
			count += numberOfBagsInsideBag(bags[obj.name]) * obj.count;
			// BLUNDER: I added 1 to the count variable instead of obj.count
			//   at first. As a result of this I submitted an invalid answer,
			//   which means I lost at least 1 minute.
			count += obj.count;
		});
		return count;
	}

	if (part === 1) {
		let sum = 0;
		Object.keys(bags).forEach((key)=>{
			if (doesContainShinyGold(bags[key])) sum++;
		});
		return sum;
	}
	else if (part === 2) {
		return numberOfBagsInsideBag(bags["shiny gold bag"]);
	}
	return null;
}