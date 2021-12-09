module.exports = (input, part, isTest) => {
	const [TARGET_LOW, TARGET_HIGH] = isTest ? [2, 5] : [17, 61];
	
	const containers = { bot: [], output: [] };
	function addToContainer(type, id, value) {
		const container = (containers[type][+id] ?? (containers[type][+id] = []));
		container.push(+value);
	}

	const definitions = [];
	for (const line of input.split("\n")) {
		if (line.startsWith("value")) {
			const [,value,botID] = line.match(/value ([0-9]+) goes to bot ([0-9]+)/);
			addToContainer("bot", +botID, value);
		}
		else {
			const [,botID,lowTargetType,lowTargetID,highTargetType,highTargetID] = line.match(/bot ([0-9]+) gives low to (bot|output) ([0-9]+) and high to (bot|output) ([0-9]+)/);
			definitions[+botID] = {
				from: +botID,
				lowType: lowTargetType,
				lowID: +lowTargetID,
				highType: highTargetType,
				highID: +highTargetID,
			};
		}
	}
	
	while (definitions.length !== 0) {
		let changed = false;
		for (let i=definitions.length-1; i>=0; i--) {
			const definition = definitions[i];
			const { from, lowType, lowID, highType, highID } = definition;
			let currentChips = containers.bot?.[from];
			if (currentChips?.length !== 2) {
				continue;
			}
			currentChips = currentChips.sort((a,b) => a-b);
			if (part === 1) {
				if ((currentChips[0] === TARGET_LOW) && (currentChips[1] === TARGET_HIGH)) {
					return from;
				}
			}
			addToContainer(lowType, lowID, currentChips[0]);
			addToContainer(highType, highID, currentChips[1]);
			definitions.splice(i, 1);
			changed = true;
		}
		if (!changed) {
			console.log("Got stuck with", definitions.length, "steps remaining.");
			return null;
		}
	}
	if (part === 2) {
		return containers.output.slice(0,3).reduce((a,b) => a * b, 1);
	}
};