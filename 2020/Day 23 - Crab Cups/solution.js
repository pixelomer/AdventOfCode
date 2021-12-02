module.exports = (input, part, isTest) => {
	const cups = []; // [0] is unused, cup 1 is at [1]
	input = input.split("");

	let currentCup = null;
	let prevCup = null;

	let cupCount = 0;
	function addCup(label) {
		cupCount++;
		const newCup = { label: label, next: null };
		if (prevCup != null) {
			prevCup.next = newCup;
		}
		else {
			currentCup = newCup;
		}
		prevCup = newCup;
		cups[label] = newCup;
	}

	for (const label of input) {
		addCup(+label);
	}

	let roundCount = 100;
	if (part === 2) {
		roundCount = 10000000;
		for (let i=10; i<=1000000; i++) {
			addCup(i);
		}
	}

	prevCup.next = currentCup;

	for (let i=0; i<roundCount; i++) {
		// (3) 8 9 1 2 5 4 6 7
		//     ^
		const pickedUp = currentCup.next;

		// (3) 2 5 4 6 7
		// [8 9 1]
		currentCup.next = pickedUp.next.next.next;

		// ==> 2
		let destLabel = currentCup.label;
		do {
			destLabel--;
			if (destLabel < 1) {
				destLabel = cupCount;
			}
		} while (
			(destLabel == pickedUp.label) ||
			(destLabel == pickedUp.next.label) ||
			(destLabel == pickedUp.next.next.label)
		);

		// (3) <2> 5 4 6 7
		// [8 9 1]
		const dest = cups[destLabel];

		// (3) <2> [8 9 1] 5 4 6 7
		pickedUp.next.next.next = dest.next;
		dest.next = pickedUp;
		
		// 3 (2) 8 9 1 5 4 6 7
		currentCup = currentCup.next;
	}
	
	if (part === 1) {
		let answer = "";
		currentCup = cups[1].next;
		while (currentCup.label !== 1) {
			answer += currentCup.label;
			currentCup = currentCup.next;
		}
		return answer;
	}
	else {
		return cups[1].next.label * cups[1].next.next.label;
	}
};