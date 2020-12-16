module.exports = (input, part) => {
	const array = input.split("\n\n");
	const fields = array[0].split("\n").reduce((acc, value) => {
		const match = value.match(/^([a-z\ ]+): ([0-9]+)\-([0-9]+) or ([0-9]+)\-([0-9]+)$/);
		const range1Start = parseInt(match[2]);
		const range1End = parseInt(match[3]);
		const range2Start = parseInt(match[4]);
		const range2End = parseInt(match[5]);
		acc[match[1]] = {
			check: (x) => (
				((x >= range2Start) && (x <= range2End)) ||
				((x >= range1Start) && (x <= range1End))
			),
			indexes: []
		};
		return acc;
	}, {});

	const nearbyTickets = array[2].split("\n").slice(1).map(value => {
		return value.split(",").map(x => parseInt(x));
	});
	const myTicket = array[1].split("\n")[1].split(",").map(x => parseInt(x));

	let errorSum = 0;
	for (let i=0; i<nearbyTickets.length; i++) {
		let containsErrors = false;
		for (let j=0; j<nearbyTickets[i].length; j++) {
			const checkSucceeded = Object.values(fields).some((field)=>{
				return field.check(nearbyTickets[i][j]);
			});
			if (!checkSucceeded) {
				containsErrors = true;
				errorSum += nearbyTickets[i][j];
			}
		}
		if (containsErrors) {
			nearbyTickets[i] = null;
		}
	}
	if (part === 1) {
		return errorSum;
	}
	else if (part === 2) {
		// Step 1: Find all possible indexes for all fields
		const discoveryFailed = Object.keys(fields).some((key)=>{
			for (let i=0; i<myTicket.length; i++) {
				const checkFailed = nearbyTickets.some((nearbyTicket)=>{
					if (nearbyTicket === null) return false;
					if (!fields[key].check(nearbyTicket[i])) {
						return true;
					}
					return false;
				});
				if (!checkFailed) {
					fields[key].indexes.push(i);
				}
			}
			if (fields[key].index === null) return true;
		});
		if (discoveryFailed) {
			return null;
		}

		// Step 2: Find the correct indexes
		while (Object.values(fields).some(value => (value.index === undefined))) {
			Object.keys(fields).forEach((key1)=>{
				fields[key1].indexes.some((index) => {
					if (!Object.keys(fields).some((key2) =>
						(fields[key2].indexes.includes(index) &&
						(key1 != key2))
					)) {
						fields[key1].index = index;
						fields[key1].indexes = [index];
						return true;
					}
					return false;
				});
			});
		}
		
		// Step 3: Multiply all of the values and return
		let result = 1;
		Object.keys(fields).forEach((key)=>{
			if (key.startsWith("departure")) {
				result *= myTicket[fields[key].index];
			}
		});
		return result;
	}
	return null;
};