module.exports = (input, part) => {
	const split = input.split("\n");

	if (part === 1) {
		const myArrivalTime = parseInt(split[0]);
		const IDs = split[1].split(",").filter((item) => item != "x").map((item) => parseInt(item));
		let timeForArrival = Number.MAX_SAFE_INTEGER;
		let ID = 0;
		for (let i=0; i<IDs.length; i++) {
			let nextArrivalTime = IDs[i];
			while (nextArrivalTime < myArrivalTime) {
				nextArrivalTime += IDs[i];
			}
			if (timeForArrival > (nextArrivalTime - myArrivalTime)) {
				timeForArrival = nextArrivalTime - myArrivalTime;
				ID = IDs[i];
			}
		}
		return timeForArrival * ID;
	}
	else if (part === 2) {
		const constraints = split[1]
			.split(",")
			.map((x) => (x == "x") ? -1 : parseInt(x));
		const buses = constraints.map((x) => ({ time: x, ID: x }));

		let constraintsSatisfied = false;
		let multiplier = 0;
		let increment = 1;
		while (!constraintsSatisfied) {
			buses[0].time = buses[0].ID * multiplier;
			constraintsSatisfied = true;
			for (let i=1; i<buses.length; i++) {
				if (buses[i].ID == -1) {
					buses[i].time = buses[i-1].time + 1;
					continue;
				}
				let newTime = 0;
				let j = 1;
				do {
					newTime = buses[i].ID * (Math.floor(buses[0].time / buses[i].ID) + j++);
				} while ((newTime - buses[i-1].time) <= 0);
				buses[i].time = newTime;
				if (buses[i].multiplier != null) {
					increment = multiplier - buses[i].multiplier;
				}
				buses[i].multiplier = multiplier;
				if (buses[i].time != (buses[i-1].time + 1)) {
					constraintsSatisfied = false;
					break;
				}
			}
			multiplier += increment;
		}
		return buses[0].time;
	}
	return null;
};